import {
  FriendlistListType,
  IncomingListType,
  OutgoingListType,
} from "./friendship.model";
import { FriendshipRespository } from "./friendship.repository";
import { Friendship } from "../../../generated/prisma";

export const FriedshipService = (repo: FriendshipRespository) => ({
  create: (
    requesterId: number,
    requesteeId: number,
  ): Promise<Response | Error | undefined> =>
    repo.create(requesterId, requesteeId),
  incomingList: (userId: number): Promise<IncomingListType[]> =>
    repo.findIncomingList(userId),
  outgoingList: (userId: number): Promise<OutgoingListType[]> =>
    repo.findOutgoingList(userId),
  find: (requesteeId: number): Promise<Friendship | null> =>
    repo.findFriend(requesteeId),
  findToken: (token: string): Promise<Pick<Friendship, "id"> | null> =>
    repo.findToken(token),
  updateStatus: (token: string, status: string): void =>
    repo.updateStatus(token, status),
  getFriendList: (
    userId: number,
    status: string,
  ): Promise<FriendlistListType[]> => repo.friendList(userId, status),
});
