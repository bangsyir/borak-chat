import { FriendshipRespository } from "../../domain/friendship/friendship.repository";
import { prisma } from "../db/db";

export const FriendshipRepositoryImpl: FriendshipRespository = {
  create: async (requesterId, requesteeId) => {
    try {
      await prisma.friendship.create({
        data: {
          requesterId: requesterId,
          requesteeId: requesteeId,
          token: Bun.randomUUIDv7(),
          status: "pending",
        },
      });
      return new Response("success");
    } catch (error) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
    }
  },
  findIncomingList: async (userId) => {
    const incomingList = await prisma.friendship.findMany({
      where: { requesteeId: userId, status: "pending" },
      select: {
        status: true,
        createdAt: true,
        requester: {
          select: {
            public_id: true,
            username: true,
          },
        },
      },
    });
    return incomingList;
  },
  findOutgoingList: async (userId) => {
    const incomingList = await prisma.friendship.findMany({
      where: { requesterId: userId, status: "pending" },
      select: {
        status: true,
        createdAt: true,
        requestee: {
          select: {
            public_id: true,
            username: true,
          },
        },
      },
    });
    return incomingList;
  },
};
