import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middlware";
import { createRoomsValidation } from "../middleware/rooms.middleware";
import { RoomsService } from "../../../domain/rooms/rooms.service";
import { RoomsRepositoryImpl } from "../../../infrastructure/repositories/rooms.repositoryImpl";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils/response.util";

type Variables = {
  user: { sub: number; publicId: string };
  createRoomsValidated: { name: string; isPrivate: boolean };
};

const roomsService = RoomsService(RoomsRepositoryImpl);

const roomsRoutes = new Hono<{ Variables: Variables }>();

roomsRoutes.use(authMiddleware);

roomsRoutes.post("/rooms", createRoomsValidation, async (c) => {
  // get currentUser for creator id
  const currentUser = c.get("user");
  // validate input
  const validated = c.get("createRoomsValidated");
  // create room
  const result = await roomsService.create(
    currentUser.sub,
    validated.name,
    validated.isPrivate,
  );
  if (!result.ok) {
    return c.json(createErrorResponse(result.message), result.statusCode);
  }
  return c.json(createSuccessResponse(result.message), result.statusCode);
});

roomsRoutes.get("/rooms", async (c) => {
  // get curent user
  const currentUser = c.get("user");
  // return rooms
  const result = await roomsService.getList(currentUser.sub);
  if (!result.ok) {
    return c.json(createErrorResponse(result.message), result.statusCode);
  }
  return c.json(
    createSuccessResponse(result.message, result.data),
    result.statusCode,
  );
});

roomsRoutes.get("/rooms/:roomId", async (c) => {
  // get current user
  // get rooms by current id
  const currentUser = c.get("user");
  const roomId = c.req.param("roomId");
  const result = await roomsService.getDetails(currentUser.sub, roomId);

  if (!result.ok) {
    return c.json(createErrorResponse(result.message), result.statusCode);
  }
  return c.json(
    createSuccessResponse(result.message, result.data),
    result.statusCode,
  );
  // check room member
  // return room details
});
export { roomsRoutes };
