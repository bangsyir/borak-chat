import { User } from "../../../generated/prisma";
import { CreateUserData } from "./user.model";

export type UserRepository = {
  create: (data: Omit<CreateUserData, "id">) => Promise<User | null>;
  findById: (id: number) => Promise<User | null>;
  findByIdWithoutPassword: (
    id: number,
  ) => Promise<Omit<User, "passwordHash"> | null>;
  findByUsername: (username: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findAll: () => Promise<User[]>;
};
