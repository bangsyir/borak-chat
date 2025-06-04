export type FriendshipRespository = {
  create: (
    requesterId: number,
    requesteeId: number,
  ) => Promise<Response | Error | undefined>;
};
