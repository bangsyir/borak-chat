export interface ResponseStatusType {
  status: string;
  createdAt: Date;
  token?: string | null;
  requestee?: {
    public_id: string;
    username: string;
  };
  requester?: {
    public_id: string;
    username: string;
  };
}

export interface FriendRequestStatus {
  status: boolean;
  message: string;
  data: ResponseStatusType[];
}
