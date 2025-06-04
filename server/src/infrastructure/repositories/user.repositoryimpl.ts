import { User } from "../../../generated/prisma";
import { CreateUserData, UpdateUserData } from "../../domain/user/user.model";
import { UserRepository } from "../../domain/user/user.repository";
import { prisma } from "../db/db";

export const userRepositoryImpl: UserRepository = {
  create: async (data: CreateUserData): Promise<User | null> => {
    const user = await prisma.user.create({
      data: {
        public_id: data.publicId,
        username: data.username,
        email: data.email,
        passwordHash: data.password,
      },
    });
    return user;
  },
  update: async (
    data: UpdateUserData,
    userId: number,
  ): Promise<Omit<User, "passwordHash">> => {
    return await prisma.user.update({
      select: {
        id: true,
        public_id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.password,
      },
      where: {
        id: userId,
      },
    });
  },
  findById: async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { id } });
  },
  findByPublicId: async (
    publicId: string,
  ): Promise<Omit<User, "passwordHash"> | null> => {
    return await prisma.user.findUnique({
      where: { public_id: publicId },
      select: {
        id: true,
        public_id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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
        public_id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};
