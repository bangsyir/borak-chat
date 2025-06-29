import { createContext, useContext, useEffect, useRef } from "react";
import { useLoaderData } from "react-router";
import { useOnlineStatusStore } from "~/hooks/useOnlineStatusStore";
import { useTypingStore } from "~/hooks/useTypingStore";

export type DirectMessageResponse = {
  id: number;
  content: string;
  is_read: boolean;
  isOwn: boolean;
  created_at: Date;
  sender: string;
};
export const WebSocketContext = createContext<{
  send: (message: any) => void;
} | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebsocket must be used within a WebSocketProvider");
  }
  return context;
};

export function ChatwebSocket({
  children,
  friendPublicId,
  onNewMessage,
}: {
  children: React.ReactNode;
  friendPublicId: string;
  onNewMessage: (value: DirectMessageResponse) => void;
}) {
  const { ENV, friendId } = useLoaderData<{
    ENV: { WS_URL: string };
    friendId: string;
  }>();
  const prevFriendIdRef = useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const send = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(ENV.WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Websocket connected");
        // ws.send(JSON.stringify({ type: "ping" }))
        ws.send(
          JSON.stringify({
            type: "presence",
            payload: {
              isInChat: true,
            },
          }),
        );
        ws.send(
          JSON.stringify({
            type: "chat_focus",
            payload: { targetPublicId: friendPublicId },
          }),
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "NEW_MESSAGE":
              if (
                data.userPublicId === friendId ||
                data.senderPublicId === friendId
              ) {
                const newMessage: DirectMessageResponse = {
                  id: data.payload.id,
                  content: data.payload.content,
                  is_read: data.payload.is_read,
                  isOwn: data.payload.isOwn,
                  created_at: data.payload.created_at,
                  sender: data.payload.sender,
                };
                onNewMessage(newMessage);
              }
              break;
            case "presence_update":
              console.log("📨 presence_update", data.userPublicId);
              useOnlineStatusStore
                .getState()
                .updateStatus(data.userPublicId, data.presence);
              break;
            case "typing_status":
              useTypingStore
                .getState()
                .setTypingStatus(data.senderPublicId, data.isTyping);
              break;
          }
        } catch (error) {
          console.error("Error parsing Websocket message: ", error);
        }
      };

      ws.onclose = () => {
        console.log("websocket disconnected, Reconnecting...");
        setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.log("Websocket error: ", error);
      };
    };

    connect();
    return () => {
      // 1. clear focus
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "chat_focus",
            payload: {
              targetPublicId: friendPublicId,
              isFocusing: false,
            },
          }),
        );

        // 2. exit chat area
        wsRef.current?.send(
          JSON.stringify({
            type: "presence",
            payload: {
              isInChat: false,
            },
          }),
        );
      }
      // 3. Close connection
      wsRef.current?.close(1000, "Client navigated away");
    };
  }, [ENV.WS_URL]);

  useEffect(() => {
    const ws = wsRef.current;
    const prevFriend = prevFriendIdRef.current;

    console.log({ prevFriend });

    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    // skip if friendPublicId is the current user's own ID
    // 1. clear previous focus friendId
    if (prevFriend) {
      console.log(`↩️ unfocus ${prevFriend}`);
      ws.send(
        JSON.stringify({
          type: "chat_focus",
          payload: {
            targetPublicId: null,
          },
        }),
      );
    }
    console.log(`👁️  focus ${friendId}`);
    // 2. set new focus friendId
    if (friendPublicId) {
      ws.send(
        JSON.stringify({
          type: "chat_focus",
          payload: {
            targetPublicId: friendPublicId,
          },
        }),
      );
    }
    prevFriendIdRef.current = friendPublicId;
  }, [friendPublicId]);
  return (
    <WebSocketContext.Provider value={{ send }}>
      {children}
    </WebSocketContext.Provider>
  );
}
