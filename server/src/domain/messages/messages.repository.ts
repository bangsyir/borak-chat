import { DirectMessage } from "../../../generated/prisma";
import { GetDirectMessageType } from "./messages.model";

export type MessagesRespository = {
  getMessages: (
    senderId: number,
    receiverId: number,
  ) => Promise<GetDirectMessageType[]>;
  sendMessage: (
    senderId: number,
    receiverId: number,
    content: string,
  ) => Promise<Pick<DirectMessage, "receiverId" | "content">>;
  updateRead: (senderId: number, receiverId: number) => Promise<any>;
};
