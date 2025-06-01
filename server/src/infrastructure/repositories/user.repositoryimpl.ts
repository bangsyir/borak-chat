import { User } from "../../../generated/prisma";
import { CreateUserData } from "../../domain/user/user.model";
import { UserRepository } from "../../domain/user/user.repository";
import { prisma } from "../db/db";

export const userRepositoryImpl: UserRepository = {
  create: async (data: CreateUserData): Promise<User | null> => {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.password,
      },
    });
    return user;
  },
  findById: async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { id } });
  },
  findByUsername: async (username: string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { username } });
  },
  findByEmail: async (email: string): Promise<User | null> => {
    return await prisma.user.findFirst({ where: { email } });
  },
  findAll: async (): Promise<User[]> => {
    return await prisma.user.findMany();
  },
  findByIdWithoutPassword: async (
    id: number,
  ): Promise<Omit<User, "passwordHash"> | null> => {
    return await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};
