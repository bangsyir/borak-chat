import { UserService } from "../user/user.service";
import { MessagesRespository } from "./messages.repository";
import { DirectMessage } from "../../../generated/prisma";
import { ResultType } from "../core/shared/response.util";
import { sendToUser } from "../../infrastructure/ws/websocketManager";

export const MessagesService = (
  messagesRepo: MessagesRespository,
  userService: ReturnType<typeof UserService>,
) => ({
  getAll: async (
    currentUserId: number,
    friendId: string,
  ): Promise<ResultType<any, any>> => {
    try {
      const friend = await userService.findByPublicId(friendId);
      if (!friend) {
        return {
          ok: false,
          message: "User not found",
          statusCode: 404,
        };
      }
      const isFriend = await userService.isFriend(currentUserId, friend.id);
      if (isFriend === false) {
        return {
          ok: false,
          message: "You are not friend yet",
          statusCode: 400,
        };
      }
      const result = await messagesRepo.getMessages(currentUserId, friend.id);
      const messages = result.map((item) => ({
        id: item.id,
        content: item.content,
        createdAt: item.created_at,
        isRead: item.is_read,
        sender: item.sender,
        isOwn: Boolean(item.isOwn),
      }));
      const data = {
        friendName: friend.username,
        messages,
      };
      return {
        ok: true,
        data: data,
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: "something wrong",
        statusCode: 500,
      };
    }
  },
  send: async (
    currentUserId: number,
    currentUserPublicId: string,
    friendId: number,
    content: string,
  ): Promise<
    ResultType<Pick<DirectMessage, "id" | "receiverId" | "content">, any>
  > => {
    try {
      const friend = await userService.findById(friendId);
      if (!friend) {
        return {
          ok: false,
          message: "Friend not found",
          statusCode: 404,
        };
      }
      const sendMessage = await messagesRepo.sendMessage(
        currentUserId,
        friend.id,
        content,
      );

      // websocket payload
      const payload = {
        id: sendMessage.id,
        content: sendMessage.content,
        createdAt: sendMessage.createdAt,
        isRead: false,
        sender: friend.username,
        isOwn: false,
      };
      sendToUser(friend.public_id, {
        type: "NEW_MESSAGE",
        userPublicId: currentUserPublicId,
        receiverPublicId: friend.public_id,
        payload: payload,
      });
      return {
        ok: true,
        message: "successfull",
        data: {
          id: sendMessage.id,
          content: sendMessage.content,
          receiverId: sendMessage.receiverId,
        },
        statusCode: 201,
      };
    } catch (error: any) {
      return { ok: false, message: "something wrong", statusCode: 500 };
    }
  },
  updateRead: async (
    friendPublicId: string,
    receiverId: number,
  ): Promise<ResultType<any, any>> => {
    try {
      const friend = await userService.findByPublicId(friendPublicId);
      if (!friend) {
        return {
          ok: false,
          message: "Friend not found",
          statusCode: 404,
        };
      }
      //console.log(friend.id, receiverId);
      const result = await messagesRepo.updateRead(friend.id, receiverId);
      if (result.count === 0) {
        return {
          ok: false,
          message: "No messages to update",
          statusCode: 400,
        };
        //throw new Error("No messages to update");
      }

      return { ok: true, statusCode: 201 };
    } catch (error) {
      return {
        ok: false,
        message: "An unexpected error occurred",
        statusCode: 500,
      };
    }
  },
});
