import { MessagesRespository } from "./messages.repository";

export const MessagesService = (repo: MessagesRespository) => ({
  getAll: (senderId: number, receiverId: number) =>
    repo.getMessages(senderId, receiverId),
  send: (senderId: number, receiverId: number, content: string) =>
    repo.sendMessage(senderId, receiverId, content),
});
