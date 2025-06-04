import { Hono } from "hono";
import { authUser } from "../middleware/auth.middlware";
import { requestFriendValidation } from "../middleware/frindship.midleware";
import { FriedshipService } from "../../../domain/friendship/friendship.service";
import { FriendshipRepositoryImpl } from "../../../infrastructure/repositories/friendsip.repositoryimpl";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils/response.util";

type Variables = {
  requesteeId: number;
  user: { sub: number; publicId: string };
};

const friendshipRoutes = new Hono<{ Variables: Variables }>();

const friendshipService = FriedshipService(FriendshipRepositoryImpl);

friendshipRoutes.post(
  "/friend-request",
  authUser,
  requestFriendValidation,
  async (c) => {
    const currentUser = c.get("user");
    const requesteeId = c.get("requesteeId");
    try {
      await friendshipService.create(currentUser.sub, requesteeId);
      return c.json(createSuccessResponse("Request friend sended"));
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createErrorResponse(error.message), 400);
      }
    }
  },
);

export { friendshipRoutes };
