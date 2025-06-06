import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middlware";
import { MessagesService } from "../../../domain/messages/messages.service";
import { MessagesRepositoryImpl } from "../../../infrastructure/repositories/messages.repositoryImpl";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils/response.util";
import { sendMessagesValidation } from "../middleware/messages.middleware";

type Variables = {
  user: { sub: number; publicId: string };
  createMessagesValidated: { content: string };
  friendId: number;
};

const messagesService = MessagesService(MessagesRepositoryImpl);

const messagesRoutes = new Hono<{ Variables: Variables }>();

messagesRoutes.get("/messages/direct/:friendId", authMiddleware, async (c) => {
  // get current auth user
  const currentUser = c.get("user");
  // search with query params
  const friendId = Number(c.get("friendId"));

  // return message
  try {
    const messages = await messagesService.getAll(currentUser.sub, friendId);
    return c.json(createSuccessResponse("Success retrive messages", messages));
  } catch (error) {
    if (error instanceof Error) {
      return c.json(createErrorResponse(error.message));
    }
  }
});

messagesRoutes.post(
  "/messages/direct/:friendId",
  authMiddleware,
  sendMessagesValidation,
  async (c) => {
    // get current auth user
    const currentUser = c.get("user");
    // search with query params
    const withUser = Number(c.req.param("friendId"));
    // check if friend status is accepted
    //
    // get validated content
    const validated = c.get("createMessagesValidated");
    try {
      const message = await messagesService.send(
        currentUser.sub,
        withUser,
        validated.content,
      );
      return c.json(createSuccessResponse("Success create message", message));
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createErrorResponse(error.message));
      }
    }

    // create new message
  },
);

export { messagesRoutes };
