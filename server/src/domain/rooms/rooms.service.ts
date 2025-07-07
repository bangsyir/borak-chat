import { OK } from "zod";
import { Prisma } from "../../../generated/prisma";
import { ResultType } from "../core/shared/response.util";
import {
  ListRoomsResponse,
  MembersListResponse,
  RoomDetailsResponse,
  RoomMessagesResponse,
} from "./rooms.model";
import { RoomsRepository } from "./rooms.repositry";
import { UserService } from "../user/user.service";

export const RoomsService = (
  repo: RoomsRepository,
  userService: ReturnType<typeof UserService>,
) => ({
  create: async (
    creatorId: number,
    name: string,
    isPrivate: boolean,
  ): Promise<ResultType<any, any>> => {
    try {
      await repo.createRoom(creatorId, name, isPrivate);
      return {
        ok: true,
        message: "Room is successfull created",
        statusCode: 201,
      };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        return {
          ok: false,
          message: error.message,
          statusCode: 500,
        };
      }
      return {
        ok: false,
        message: error.message,
        statusCode: 500,
      };
    }
  },
  getList: async (
    userId: number,
  ): Promise<ResultType<ListRoomsResponse[], any>> => {
    try {
      const rooms = await repo.getRooms(userId);
      const result = rooms.map((item) => ({
        publicId: item.publicId,
        name: item.name,
        lastMessage: item.lastMessage,
        lastMessageCreated: item.lastMessageCreated,
        totalMember: item.totalMember.toString(),
        isPrivate: item.isPrivate,
      }));
      return {
        ok: true,
        message: "success",
        data: result,
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error.message,
        statusCode: 500,
      };
    }
  },
  getDetails: async (
    userId: number,
    publicRoomId: string,
  ): Promise<
    ResultType<
      Omit<RoomDetailsResponse, "id"> & { members: MembersListResponse[] },
      null
    >
  > => {
    try {
      const room = await repo.getDetails(publicRoomId);
      if (!room) {
        return {
          ok: false,
          message: "room not found",
          statusCode: 400,
        };
      }
      const isMember = await repo.isMember(userId, room.id);
      if (!isMember) {
        return {
          ok: false,
          message: "Ops you are not member",
          statusCode: 400,
        };
      }
      const members = await repo.getMembers(room.id);
      return {
        ok: true,
        message: "successfull",
        data: {
          publicId: room.publicId,
          name: room.name,
          members: members,
        },
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error.message,
        statusCode: 500,
      };
    }
  },

  getMessages: async (
    userId: number,
    publicRoomId: string,
  ): Promise<
    ResultType<{ room_name: string; messages: RoomMessagesResponse[] }, any>
  > => {
    try {
      const room = await repo.findRoom(publicRoomId);
      if (!room) {
        return {
          ok: false,
          message: "room not found",
          statusCode: 404,
        };
      }
      const isMember = await repo.isMember(userId, room.id);
      if (!isMember) {
        return {
          ok: false,
          message: "You are not member",
          statusCode: 400,
        };
      }
      const messages = await repo.getRoomMessages(room.id, userId);

      (async () => {
        try {
          await repo.updateRoomMessageRead(userId, room.id, messages[0].id);
        } catch (error) {
          throw new Error("failed to update read status");
        }
      })();
      return {
        ok: true,
        message: "success",
        data: {
          room_name: room.name,
          messages,
        },
        statusCode: 200,
      };
    } catch (error: any) {
      return { ok: false, message: error.messages, statusCode: 500 };
    }
  },
  sendMessage: async (
    userId: number,
    publicRoomId: string,
    content: string,
  ): Promise<ResultType<any, any>> => {
    const room = await repo.findRoom(publicRoomId);
    if (!room) {
      return {
        ok: false,
        message: "room not found",
        statusCode: 404,
      };
    }
    const isMember = await repo.isMember(userId, room.id);
    if (!isMember) {
      return {
        ok: false,
        message: "You are not member",
        statusCode: 400,
      };
    }
    try {
      await repo.sendMessage(userId, room.id, content);
      return {
        ok: true,
        message: "success send message",
        statusCode: 201,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error.message,
        statusCode: 500,
      };
    }
  },
  invitation: async (
    userId: number,
    publicFriendId: string,
    publicRoomId: string,
  ): Promise<ResultType<null, null>> => {
    const friend = await userService.findByPublicId(publicFriendId);
    if (!friend) {
      return {
        ok: false,
        message: "Friend not found",
        statusCode: 400,
      };
    }
    const room = await repo.findRoom(publicRoomId);
    if (!room) {
      return {
        ok: false,
        message: "room not found",
        statusCode: 404,
      };
    }
    // chekc if friend is room member
    const isFriendIsMember = await repo.isMember(friend.id, room.id);

    if (isFriendIsMember) {
      return {
        ok: false,
        message: "this user is member",
        statusCode: 401,
      };
    }
    // check admin is member and isadmin
    const isMember = await repo.isMember(userId, room.id);
    if (!isMember) {
      return {
        ok: false,
        message: "You are not member",
        statusCode: 400,
      };
    }
    if (!isMember.isAdmin) {
      return {
        ok: false,
        message: "You not allowed to create invitaion",
        statusCode: 401,
      };
    }
    try {
      await repo.createInvitation(friend.id, room.id);
      return {
        ok: false,
        message: "Invitaion created",
        statusCode: 201,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error.message,
        statusCode: 500,
      };
    }
  },
  //updateReadMessage: async (
  //  userId: number,
  //  publicRoomId: string,
  //  lastMessagesId: number,
  //) => {
  //  try {
  //    const room = await repo.findRoom(publicRoomId);
  //    if (!room) {
  //      return {
  //        ok: false,
  //        message: "room not found",
  //        statusCode: 404,
  //      };
  //    }
  //    const isMember = await repo.isMember(userId, room.id);
  //    if (!isMember) {
  //      return {
  //        ok: false,
  //        message: "You are not member",
  //        statusCode: 400,
  //      };
  //    }
  //    await repo.updateRoomMessageRead(userId, room.id, lastMessagesId);
  //    return {
  //      ok: true,
  //      message: "success update the user",
  //    };
  //  } catch (error: any) {
  //    return {
  //      ok: false,
  //      message: error.message,
  //      statusCode: 500,
  //    };
  //  }
  //},
});
