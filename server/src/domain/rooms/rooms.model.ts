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
  totalMember: string;
  isPrivate: boolean;
};
export type FindMemberResponse = {
  id: number;
  isAdmin: boolean;
};
export type MembersListResponse = {
  publicId: string;
  username: string;
  isAdmin: boolean;
};

export type RoomDetailsResponse = {
  id: number;
  publicId: string;
  name: string;
};

export type RoomMessagesResponse = {
  id: number;
  content: string;
  sender: string;
  createdAt: Date;
};
