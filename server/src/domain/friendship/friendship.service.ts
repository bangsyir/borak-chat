import { FriendshipRespository } from "./friendship.repository";

export const FriedshipService = (repo: FriendshipRespository) => ({
  create: async (
    requesterId: number,
    requesteeId: number,
  ): Promise<Response | Error | undefined> =>
    await repo.create(requesterId, requesteeId),
});
