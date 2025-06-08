import {
  CreateUserData,
  UpdateUserData,
  UserType,
} from "../../domain/user/user.model";
import { UserRepository } from "../../domain/user/user.repository";
import { prisma } from "../db/db";

export const UserRepositoryImpl: UserRepository = {
  create: async (data: CreateUserData): Promise<UserType | null> => {
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
  ): Promise<Omit<UserType, "passwordHash">> => {
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
  findById: async (id: number): Promise<UserType | null> => {
    return await prisma.user.findUnique({ where: { id } });
  },
  findByPublicId: async (
    publicId: string,
  ): Promise<Omit<UserType, "passwordHash"> | null> => {
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
  findByUsername: async (username: string): Promise<UserType | null> => {
    return await prisma.user.findUnique({ where: { username } });
  },
  findByEmail: async (email: string): Promise<UserType | null> => {
    return await prisma.user.findFirst({ where: { email } });
  },
  findAll: async (): Promise<UserType[]> => {
    return await prisma.user.findMany();
  },
  findByIdWithoutPassword: async (
    id: number,
  ): Promise<Omit<UserType, "passwordHash"> | null> => {
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
  isFriend: async (requesterId: number, requesteeId: number) => {
    const isFriend = await prisma.friendship.findFirst({
      where: {
        status: "accepted",
        OR: [
          { requesterId: requesterId, requesteeId: requesteeId },
          { requesterId: requesteeId, requesteeId: requesterId },
        ],
      },
    });
    if (isFriend === null) {
      return false;
    }
    return true;
  },
};
