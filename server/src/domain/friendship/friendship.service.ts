import { IncomingListType, OutgoingListType } from "./friendship.model";
import { FriendshipRespository } from "./friendship.repository";

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
});
