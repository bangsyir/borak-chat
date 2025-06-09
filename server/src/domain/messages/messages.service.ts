import { UserService } from "../user/user.service";
import { MessagesRespository } from "./messages.repository";
import { DirectMessage } from "../../../generated/prisma";
import { ResultType } from "../core/shared/response.util";

export const MessagesService = (
  messagesRepo: MessagesRespository,
  userService: ReturnType<typeof UserService>,
) => ({
  getAll: async (
    receiverId: number,
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
      const isFriend = await userService.isFriend(receiverId, friend.id);
      if (isFriend === false) {
        return {
          ok: false,
          message: "You are not friend yet",
          statusCode: 400,
        };
      }
      const data = await messagesRepo.getMessages(receiverId, friend.id);
      return {
        ok: true,
        data: data,
        statusCode: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: "something wrong",
        statusCode: 500,
      };
    }
  },
  send: async (
    receiverId: number,
    publicFriendId: string,
    content: string,
  ): Promise<
    ResultType<Pick<DirectMessage, "receiverId" | "content">, any>
  > => {
    try {
      const friend = await userService.findByPublicId(publicFriendId);
      if (!friend) {
        return {
          ok: false,
          message: "Friend not found",
          statusCode: 404,
        };
      }

      const sendMessage = await messagesRepo.sendMessage(
        receiverId,
        friend.id,
        content,
      );
      return {
        ok: true,
        message: "successfull",
        data: {
          content: sendMessage.content,
          receiverId: sendMessage.receiverId,
        },
        statusCode: 201,
      };
    } catch (error) {
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
