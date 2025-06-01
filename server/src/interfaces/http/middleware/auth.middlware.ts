import { z } from "zod";
import { createErrorResponse } from "../../../shared/utils/response.util";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const loginSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  username: z.string().min(5),
  email: z.string().email().optional(),
  password: z.string().min(8),
});

export const validateLogin = createMiddleware(async (c, next) => {
  const data = await c.req.json();
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return c.json(
      createErrorResponse("input error", result.error.flatten().fieldErrors),
      400,
    );
  }
  c.set("validateLoginData", result.data);
  return next();
});

export const validateRegister = createMiddleware(async (c, next) => {
  const data = await c.req.json();
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return c.json(
      createErrorResponse("input error", result.error.flatten().fieldErrors),
      400,
    );
  }
  c.set("validateRegisterData", result.data);
  return next();
});

export const authUser = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return c.json(createErrorResponse("Credential not found"), 401);
  }
  const payload = await verify(token, Bun.env.JWT_SECRET!);
  c.set("userId", payload?.sub);
  return next();
});
export type LoginParams = z.infer<typeof loginSchema>;
export type RegisterParams = z.infer<typeof registerSchema>;
