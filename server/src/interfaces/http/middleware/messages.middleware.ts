import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { createErrorResponse } from "../../../shared/utils/response.util";

const CreateMessageSchema = z.object({
  content: z.string().min(1),
});

export const sendMessagesValidation = createMiddleware(async (c, next) => {
  const data = await c.req.json();
  const result = CreateMessageSchema.safeParse(data);

  if (!result.success) {
    return c.json(
      createErrorResponse("field error", result.error.flatten().fieldErrors),
    );
  }
  c.set("createMessagesValidated", result.data);
  await next();
});
