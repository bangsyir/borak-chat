export type FriendshipRequestInput = {
  requesterId: number;
  requesteeId: number;
};

export type IncomingListType = {
  status: string;
  createdAt: Date;
  requester: {
    public_id: string;
    username: string;
  };
};

export type OutgoingListType = {
  status: string;
  createdAt: Date;
  requestee: {
    public_id: string;
    username: string;
  };
};
