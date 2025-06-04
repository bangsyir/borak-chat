import { z } from "zod";
import { createErrorResponse } from "../../../shared/utils/response.util";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { UserService } from "../../../domain/user/user.service";
import { userRepositoryImpl } from "../../../infrastructure/repositories/user.repositoryimpl";

// initialize services
const userService = UserService(userRepositoryImpl);

export const loginSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  username: z.string().min(5),
  email: z.string().email().optional(),
  password: z.string().min(8),
});

// check availableity user inside zod (username, email)
export const userUpdateSchema = registerSchema
  .partial()
  .superRefine(async ({ username, email }, ctx) => {
    if (username !== undefined) {
      const usernameExist = await userService.findByUsername(username);
      if (usernameExist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "This username is already taken",
          path: ["username"],
        });
      }
    }
    if (email !== undefined) {
      const usernameExist = await userService.findByEmail(email);
      if (usernameExist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "This email is already taken",
          path: ["email"],
        });
      }
    }
  });

// middleware business logic
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

export const validateUserUpdate = createMiddleware(async (c, next) => {
  const data = await c.req.json();
  const result = await userUpdateSchema.safeParseAsync(data);
  if (!result.success) {
    return c.json(
      createErrorResponse("Error", result.error.flatten().fieldErrors),
      400,
    );
  }
  c.set("validateUserUpdate", result.data);
  return next();
});

// authentication middleware
export const authUser = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return c.json(createErrorResponse("Invalid Credentials"), 401);
  }
  const payload = await verify(token, Bun.env.JWT_SECRET!);
  if (payload.sub === undefined || payload.publicId === undefined) {
    return c.json(createErrorResponse("Invalid Credentials"), 401);
  }
  c.set("user", { sub: payload.sub, publicId: payload.publicId });
  return next();
});

export type LoginParams = z.infer<typeof loginSchema>;
export type RegisterParams = z.infer<typeof registerSchema>;
