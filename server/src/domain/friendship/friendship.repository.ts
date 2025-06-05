import { Friendship } from "../../../generated/prisma";
import {
  FriendlistListType,
  IncomingListType,
  OutgoingListType,
} from "./friendship.model";

export type FriendshipRespository = {
  create: (
    requesterId: number,
    requesteeId: number,
  ) => Promise<Response | Error | undefined>;
  findIncomingList: (userId: number) => Promise<IncomingListType[]>;
  findOutgoingList: (userId: number) => Promise<OutgoingListType[]>;
  findFriend: (requesteeId: number) => Promise<Friendship | null>;
  findToken: (token: string) => Promise<Pick<Friendship, "id"> | null>;
  updateStatus: (token: string, status: string) => void;
  friendList: (userId: number, status: string) => Promise<FriendlistListType[]>;
};
