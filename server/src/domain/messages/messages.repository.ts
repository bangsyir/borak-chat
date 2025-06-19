import { DirectMessage } from "../../../generated/prisma";
import { GetDirectMessageResponse } from "./messages.model";

export type MessagesRespository = {
  getMessages: (
    currentUserId: number,
    friendId: number,
  ) => Promise<GetDirectMessageResponse[]>;
  sendMessage: (
    senderId: number,
    receiverId: number,
    content: string,
  ) => Promise<Pick<DirectMessage, "receiverId" | "content">>;
  updateRead: (senderId: number, receiverId: number) => Promise<any>;
};
