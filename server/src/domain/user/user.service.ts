import { User } from "../../../generated/prisma";
import { CreateUserData, UpdateUserData } from "./user.model";
import { UserRepository } from "./user.repository";

export const UserService = (repo: UserRepository) => ({
  create: (data: CreateUserData): Promise<User | null> => repo.create(data),
  update: (
    data: UpdateUserData,
    userId: number,
  ): Promise<Omit<User, "passwordHash"> | null> => repo.update(data, userId),
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
