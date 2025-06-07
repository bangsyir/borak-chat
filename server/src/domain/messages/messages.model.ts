export type GetDirectMessageType = {
  id: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender: {
    username: string;
  };
  receiver: {
    username: string;
  };
};
