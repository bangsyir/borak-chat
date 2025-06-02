import { Omit } from "@prisma/client/runtime/library";
import { User } from "../../../generated/prisma";
import { CreateUserData, UpdateUserData } from "./user.model";

export type UserRepository = {
  create: (data: Omit<CreateUserData, "id">) => Promise<User | null>;
  update: (
    data: UpdateUserData,
    userId: number,
  ) => Promise<Omit<User, "passwordHash"> | null>;
  findById: (id: number) => Promise<User | null>;
  findByIdWithoutPassword: (
    id: number,
  ) => Promise<Omit<User, "passwordHash"> | null>;
  findByUsername: (username: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findAll: () => Promise<User[]>;
};
