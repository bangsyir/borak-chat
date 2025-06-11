import {
  CreateRoomsResponse,
  FindMemberResponse,
  ListRoomsResponse,
  MembersListResponse,
  RoomDetailsResponse,
  RoomMessagesResponse,
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
  getDetails: (publicRoomId: string) => Promise<RoomDetailsResponse | null>;
  getMembers: (RoomId: number) => Promise<MembersListResponse[]>;
  findRoom: (publicRoomId: string) => Promise<RoomDetailsResponse | null>;
  getRoomMessages: (roomId: number) => Promise<RoomMessagesResponse[]>;
  sendMessage: (
    userId: number,
    roomId: number,
    content: string,
  ) => Promise<{ id: number } | null>;
  createInvitation: (friendId: number, roomId: number) => Promise<any>;
  updateRoomMessageRead: (
    userId: number,
    roomId: number,
    lastMessageId: number,
  ) => Promise<any>;
};
