import { z } from "zod";
import { UserService } from "../../../domain/user/user.service";
import { userRepositoryImpl } from "../../../infrastructure/repositories/user.repositoryimpl";
import { createMiddleware } from "hono/factory";
import { createErrorResponse } from "../../../shared/utils/response.util";

const userService = UserService(userRepositoryImpl);

export const checkFrienshipSchema = z.object({
  friendPublicId: z.string().min(10),
});

export const requestFriendValidation = createMiddleware(async (c, next) => {
  const currentUser = c.get("user");
  const data = await c.req.json();
  const result = await checkFrienshipSchema.safeParseAsync(data);
  if (!result.success) {
    return c.json(
      createErrorResponse("invalid field", result.error.flatten().fieldErrors),
      400,
    );
  }
  if (currentUser.publicId === result.data.friendPublicId) {
    return c.json(
      createErrorResponse("cannot sent friend request to yourself"),
      400,
    );
  }
  const requestee = await userService.findByPublicId(
    result.data.friendPublicId,
  );
  if (!requestee) {
    return c.json(
      createErrorResponse("not found", {
        friendPublicId: ["Friend not found"],
      }),
      404,
    );
  }
  c.set("requesteeId", requestee.id);
  return next();
});
