//import * as jwt from "jsonwebtoken";
import { sign } from "hono/jwt";
import { AuthRepository } from "../../domain/auth/auth.repository";
//import { hash, verify } from "argon2";

export const authRepositoryImpl: AuthRepository = {
  hashPassword: async (plain) =>
    await Bun.password.hash(plain, {
      algorithm: "argon2id",
      memoryCost: 19456,
      timeCost: 2,
    }),
  comparePassword: async (plain, hash) =>
    await Bun.password.verify(plain, hash),
  genereteToken: async (userId) =>
    await sign(
      { sub: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 2 },
      Bun.env.JWT_SECRET!,
      "HS256",
    ),
};
