import { User } from "../../../generated/prisma";
import { CreateUserData } from "./user.model";
import { UserRepository } from "./user.repository";

export const userService = (repo: UserRepository) => ({
  create: (data: CreateUserData): Promise<User | null> => repo.create(data),
  getAll: (): Promise<User[]> => repo.findAll(),
  findById: (id: number): Promise<User | null> => repo.findById(id),
  findByIdWithoutPassowrd: (
    id: number,
  ): Promise<Omit<User, "passwordHash"> | null> =>
    repo.findByIdWithoutPassword(id),
  findByUsername: (username: string): Promise<User | null> =>
    repo.findByUsername(username),
  findByEmail: (email: string): Promise<User | null> => repo.findByEmail(email),
});
