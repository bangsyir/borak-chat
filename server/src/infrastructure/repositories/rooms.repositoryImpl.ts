import { RoomMessagesResponse } from "../../domain/rooms/rooms.model";
import { RoomsRepository } from "../../domain/rooms/rooms.repositry";
import { prisma } from "../db/db";

export const RoomsRepositoryImpl: RoomsRepository = {
  createRoom: async (creatorId, name, isPrivate) => {
    return await prisma.room.create({
      data: {
        creatorId,
        name,
        isPrivate,
        members: {
          create: {
            userId: creatorId,
            isAdmin: true,
          },
        },
        UserRoomStatus: {
          create: {
            userId: creatorId,
          },
        },
      },
      select: {
        creatorId: true,
        name: true,
        isPrivate: true,
      },
    });
  },
  getRooms: async (userId) => {
    return await prisma.$queryRaw`
        WITH LatestGroupMessage AS (
          SELECT
            rm.room_id,
            rm.content,
            rm.created_at,
          ROW_NUMBER() OVER (PARTITION BY rm.room_id ORDER BY rm.created_at DESC) as rn
          FROM room_messages as rm
        ),
        RoomMemberCount AS (
          SELECT
            rm.room_id,
            COUNT(DISTINCT rm.user_id) as totalMemberCount
          FROM room_members as rm 
          GROUP BY rm.room_id
        )
        SELECT DISTINCT 
          r.public_id AS publicId, 
          r.name AS name, 
          lgm.content AS lastMessage, 
          lgm.created_at AS lastMessageCreated,
          rmc.totalMemberCount as totalMember,
          r.is_private as isPrivate
        FROM room_members as rm
        JOIN rooms AS r ON rm.room_id = r.id
        LEFT JOIN LatestGroupMessage as lgm ON r.id = lgm.room_id AND lgm.rn = 1
        LEFT JOIN RoomMemberCount as rmc ON r.id = rmc.room_id
        WHERE user_id = ${userId}
        ORDER BY lgm.created_at DESC NULLS LAST
        ;
    `;
  },
  isMember: async (userId, roomId) => {
    return await prisma.roomMember.findFirst({
      where: {
        userId,
        roomId,
      },
      select: {
        id: true,
        isAdmin: true,
      },
    });
  },
  getDetails: async (publicRoomId) => {
    return await prisma.room.findFirst({
      where: {
        publicId: publicRoomId,
      },
      select: {
        id: true,
        publicId: true,
        name: true,
      },
    });
  },
  getMembers: async (roomId) => {
    return await prisma.$queryRaw`
      SELECT u.public_id as publicId, u.username as username, rm.is_admin as isAdmin
      FROM room_members as rm
      JOIN users as u ON u.id = rm.user_id
      WHERE rm.room_id = ${roomId};
    `;
  },
  findRoom: async (publicRoomId) => {
    return await prisma.room.findFirst({
      where: {
        publicId: publicRoomId,
      },
      select: {
        id: true,
        publicId: true,
        name: true,
      },
    });
  },
  getRoomMessages: async (roomId) => {
    const roomMessages = await prisma.roomMessage.findMany({
      where: {
        roomId: roomId,
      },
      select: {
        id: true,
        content: true,
        sender: {
          select: {
            username: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const messages: RoomMessagesResponse[] = roomMessages.map((item) => ({
      id: item.id,
      content: item.content,
      sender: item.sender.username,
      createdAt: item.createdAt,
    }));
    return messages;
  },
  sendMessage: async (userId, roomId, content) => {
    return await prisma.roomMessage.create({
      data: {
        senderId: userId,
        roomId,
        content,
        statuses: {
          create: {
            roomId,
            userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  },
  createInvitation: async (userId: number, roomId: number) => {
    await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        members: {
          create: {
            userId: userId,
          },
        },
        UserRoomStatus: {
          create: {
            userId: userId,
          },
        },
      },
    });
    return;
  },
  updateRoomMessageRead: async (userId, roomId, lastMessageId) => {
    return await prisma.userRoomStatus.update({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      data: {
        lastReadMessageId: lastMessageId,
      },
    });
  },
};
