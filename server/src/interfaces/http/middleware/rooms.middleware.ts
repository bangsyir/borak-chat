import { createMiddleware } from "hono/factory";
import { createRoomsSchema } from "../../../domain/rooms/rooms.schema";
import { createErrorResponse } from "../../../shared/utils/response.util";

export const createRoomsValidation = createMiddleware(async (c, next) => {
  const data = await c.req.json();
  const result = createRoomsSchema.safeParse(data);
  if (!result.success) {
    return c.json(
      createErrorResponse("Field error", result.error.flatten().fieldErrors),
      400,
    );
  }
  c.set("createRoomsValidated", result.data);
  await next();
});
