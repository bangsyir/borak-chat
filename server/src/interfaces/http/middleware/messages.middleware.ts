import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { createErrorResponse } from "../../../shared/utils/response.util";
import { UserService } from "../../../domain/user/user.service";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/user.repositoryimpl";
import { FriendshipRepositoryImpl } from "../../../infrastructure/repositories/friendsip.repositoryimpl";
import { FriendshipService } from "../../../domain/friendship/friendship.service";

const CreateMessageSchema = z.object({
  content: z.string().min(1),
});

const userService = UserService(UserRepositoryImpl);
const friendService = FriendshipService(FriendshipRepositoryImpl);

export const sendMessagesValidation = createMiddleware(async (c, next) => {
  const data = await c.req.json();
  const publicId = c.req.param("friendId");
  const result = CreateMessageSchema.safeParse(data);

  if (!result.success) {
    return c.json(
      createErrorResponse("field error", result.error.flatten().fieldErrors),
    );
  }

  if (!publicId) {
    return c.json(createErrorResponse("public id is needed"), 400);
  }
  // get public friend id
  const user = await userService.findByPublicId(publicId);
  if (!user) {
    return c.json(createErrorResponse("User not found"), 401);
  }
  const isFriend = await friendService.find(user.id);
  if (!isFriend || isFriend.status !== "accepted") {
    return c.json(createErrorResponse("you not friend ye"), 400);
  }
  c.set("friendId", isFriend.id);
  c.set("createMessagesValidated", result.data);
  await next();
});
