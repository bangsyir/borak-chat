export type CreateRoomsResponse = {
  creatorId: number;
  name: string;
  isPrivate: boolean;
};
export type ListRoomsResponse = {
  publicId: number;
  name: string;
  lastMessage?: string | null;
  lastMessageCreated?: Date | null;
};
export type FindMemberResponse = {
  id: number;
};
export type MembersListResponse = {
  publicId: string;
  username: string;
};

export type RoomDetailsRespomse = {
  id: number;
  publicId: string;
  name: string;
};
