import { DirectMessage } from "../../../generated/prisma";

export type GetDirectMessageType = Pick<
  DirectMessage,
  "id" | "content" | "isRead" | "createdAt"
> & { sender: { username: string } } & { receiver: { username: string } };
