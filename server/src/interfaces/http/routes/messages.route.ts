import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middlware";
import { MessagesService } from "../../../domain/messages/messages.service";
import { MessagesRepositoryImpl } from "../../../infrastructure/repositories/messages.repositoryImpl";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils/response.util";
import { sendMessagesValidation } from "../middleware/messages.middleware";
import { UserService } from "../../../domain/user/user.service";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/user.repositoryimpl";

type Variables = {
  user: { sub: number; publicId: string };
  createMessagesValidated: { content: string };
  friendId: number;
};

const messagesService = MessagesService(
  MessagesRepositoryImpl,
  UserService(UserRepositoryImpl),
);

const messagesRoutes = new Hono<{ Variables: Variables }>();

messagesRoutes.use(authMiddleware);

messagesRoutes.use(async (c, next) => {
  // get current auth user
  const currentUser = c.get("user");
  // search with query params
  const publicFriendId = c.req.param("friendId");
  if (publicFriendId === currentUser.publicId) {
    return c.json(createErrorResponse("Cannot do action to yourself"));
  }
  await next();
});

messagesRoutes.get("/messages/direct/:friendId", async (c) => {
  // get current auth user
  const currentUser = c.get("user");
  // search with query params
  const friendId = c.req.param("friendId");

  // return message
  const messages = await messagesService.getAll(currentUser.sub, friendId);
  if (messages.ok === false) {
    return c.json(createErrorResponse(messages.message), messages.statusCode);
  }
  return c.json(
    createSuccessResponse("success retrive messages", messages.data),
    messages.statusCode,
  );
});

messagesRoutes.post(
  "/messages/direct/:friendId",
  authMiddleware,
  sendMessagesValidation,
  async (c) => {
    // get current auth user
    const currentUser = c.get("user");
    // search with query params
    const publicFriendId = c.req.param("friendId");
    // check if friend status is accepted
    // get validated content
    const validated = c.get("createMessagesValidated");
    // create new message
    const result = await messagesService.send(
      currentUser.sub,
      publicFriendId,
      validated.content,
    );
    if (result.ok === false) {
      return c.json(createErrorResponse(result.message), result.statusCode);
    }
    return c.json(
      createSuccessResponse("Success create message", result.data),
      result.statusCode,
    );
  },
);
messagesRoutes.put("/messages/direct/:friendId", async (c) => {
  // get both requester_id and requestee_id
  const currentUser = c.get("user");
  const requesteeId = c.req.param("friendId"); // this is publicId
  // find messages if isRead is false
  // please make sure validation inside services
  // update message status
  const updateRead = await messagesService.updateRead(
    currentUser.sub,
    requesteeId,
  );
  // return error
  if (updateRead?.ok === false) {
    return c.json(
      createErrorResponse(updateRead?.message),
      updateRead.statusCode,
    );
  }
  // return sucess
  return c.json(createSuccessResponse("you read all message"));
});
export { messagesRoutes };
