import { CreateUserData } from "../user/user.model";
import { userService } from "../user/user.service";
import { AuthCredentials, AuthResult } from "./auth.model";
import { type AuthRepository } from "./auth.repository";
import { User } from "../../../generated/prisma";

export const authService = (
  userservice: ReturnType<typeof userService>,
  authRepo: AuthRepository,
) => ({
  login: async (credentials: AuthCredentials): Promise<AuthResult> => {
    const user = await userservice.findByUsername(credentials.username);
    if (!user) throw new Error("Invalid username or password");

    const isValid = await authRepo.comparePassword(
      credentials.password,
      user.passwordHash,
    );
    if (!isValid) throw new Error("Invalid username or password");

    const token = await authRepo.genereteToken(user.id);
    return { token };
  },
  register: async (input: CreateUserData): Promise<{ message: string }> => {
    const existUser = await userservice.findByUsername(input.username);
    if (existUser) throw new Error("User already exists");

    if (input.email !== undefined) {
      const existEmail = await userservice.findByEmail(input.email);
      if (existEmail) throw new Error("User already exists");
    }
    const hashed = await authRepo.hashPassword(input.password);
    await userservice.create({
      username: input.username,
      email: input.email,
      password: hashed,
    });

    return { message: "success" };
  },
  me: async (userId: number): Promise<Omit<User, "passwordHash">> => {
    const user = await userservice.findByIdWithoutPassowrd(userId);
    if (!user) throw new Error("User Not Found");
    return user;
  },
});
