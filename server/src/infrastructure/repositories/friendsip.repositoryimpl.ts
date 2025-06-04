import { FriendshipRespository } from "../../domain/friendship/friendship.repository";
import { prisma } from "../db/db";

export const FriendshipRepositoryImpl: FriendshipRespository = {
  create: async (requesterId, requesteeId) => {
    try {
      await prisma.friendship.create({
        data: {
          requesterId: requesterId,
          requesteeId: requesteeId,
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
};
