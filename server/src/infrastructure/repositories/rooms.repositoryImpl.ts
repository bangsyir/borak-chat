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
)
SELECT DISTINCT r.public_id AS publicId, r.name AS name, lgm.content AS lastMessage, lgm.created_at AS lastMessageCreated FROM room_members as rm
JOIN rooms AS r ON rm.user_id = r.creator_id
LEFT JOIN LatestGroupMessage as lgm ON r.id = lgm.room_id AND lgm.rn = 1
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
      SELECT u.public_id as publicId, u.username as username
      FROM room_members as rm
      JOIN users as u ON u.id = rm.user_id
      WHERE rm.room_id = ${roomId};
    `;
  },
};
