import { MessagesRespository } from "../../domain/messages/messages.repository";
import { prisma } from "../db/db";

export const MessagesRepositoryImpl: MessagesRespository = {
  getMessages: async (senderId, receiverId) => {
    return await prisma.directMessage.findMany({
      where: {
        AND: [{ senderId: senderId }, { receiverId: receiverId }],
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        isRead: true,
        createdAt: true,
        sender: {
          select: {
            username: true,
          },
        },
        receiver: {
          select: {
            username: true,
          },
        },
      },
    });
  },
  sendMessage: async (senderId, receiverId, content) => {
    return await prisma.directMessage.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      select: {
        receiverId: true,
        content: true,
      },
    });
  },
};
