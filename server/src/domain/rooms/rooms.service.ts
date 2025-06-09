import { Prisma } from "../../../generated/prisma";
import { ResultType } from "../core/shared/response.util";
import {
  GetRoomsDetailsResponse,
  ListRoomsResponse,
  MembersListResponse,
  RoomDetailsRespomse,
} from "./rooms.model";
import { RoomsRepository } from "./rooms.repositry";

export const RoomsService = (repo: RoomsRepository) => ({
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
  ): Promise<ResultType<ListRoomsResponse, any>> => {
    try {
      const rooms = await repo.getRooms(userId);
      return {
        ok: true,
        message: "success",
        data: rooms,
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
      Omit<RoomDetailsRespomse, "id"> & { members: MembersListResponse[] },
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
});
