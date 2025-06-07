import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  username: z.string().min(5),
  email: z.string().email().optional(),
  password: z.string().min(8),
});

export const userUpdateSchema = registerSchema.partial();
