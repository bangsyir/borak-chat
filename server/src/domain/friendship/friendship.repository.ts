import { IncomingListType, OutgoingListType } from "./friendship.model";

export type FriendshipRespository = {
  create: (
    requesterId: number,
    requesteeId: number,
  ) => Promise<Response | Error | undefined>;
  findIncomingList: (userId: number) => Promise<IncomingListType[]>;
  findOutgoingList: (userId: number) => Promise<OutgoingListType[]>;
};
