import { DirectMessage } from "../../../generated/prisma";
import { GetDirectMessageResponse } from "./messages.model";

export type MessagesRespository = {
  getMessages: (
    currentUserId: number,
    friendId: number,
    pageLimit: number,
    offset: number,
  ) => Promise<GetDirectMessageResponse[]>;
  countMessage: (currentUserId: number, friendId: number) => Promise<number>;
  sendMessage: (
    senderId: number,
    receiverId: number,
    content: string,
  ) => Promise<DirectMessage>;
  updateRead: (senderId: number, receiverId: number) => Promise<any>;
};
