import {
  CreateRoomsResponse,
  FindMemberResponse,
  ListRoomsResponse,
  MembersListResponse,
  RoomDetailsRespomse,
} from "./rooms.model";

export type RoomsRepository = {
  createRoom: (
    creatorId: number,
    name: string,
    isPrivate: boolean,
  ) => Promise<CreateRoomsResponse>;
  getRooms: (userId: number) => Promise<ListRoomsResponse>;
  isMember: (
    userId: number,
    roomId: number,
  ) => Promise<FindMemberResponse | null>;
  getDetails: (publicRoomId: string) => Promise<RoomDetailsRespomse | null>;
  getMembers: (RoomId: number) => Promise<MembersListResponse[]>;
};
