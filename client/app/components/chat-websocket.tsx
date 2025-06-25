import { useEffect, useRef } from "react";
import { useLoaderData, useRevalidator } from "react-router";

export type DirectMessageResponse = {
  id: number;
  content: string;
  is_read: boolean;
  isOwn: boolean;
  created_at: Date;
  sender: string;
};

export function ChatwebSocket({
  userPublicId,
  onNewMessage,
  onOnlineStatus
}: {
  userPublicId: string
  onNewMessage: (value: DirectMessageResponse) => void,
  onOnlineStatus: (value: boolean) => void
}) {
  const { ENV, friendId } = useLoaderData<{
    ENV: { WS_URL: string },
    friendId: string
  }>()
  const revalidator = useRevalidator()
  // const fetcher = useFetcher()
  const wsRef = useRef<WebSocket | null>(null)
  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(ENV.WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("Websocket connected")
        // ping the server to get online status
        ws.send("ping")
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "pong") return

          if (data.type === "NEW_MESSAGE") {
            if (data.userPublicId === friendId || data.senderPublicId === friendId) {
              const newMessage: DirectMessageResponse = {
                id: data.payload.id,
                content: data.payload.content,
                is_read: data.payload.is_read,
                isOwn: data.payload.isOwn,
                created_at: data.payload.created_at,
                sender: data.payload.sender
              }
              onNewMessage(newMessage)
            }
            return
          }

          if (data.type === "online_status") {
            if (data.userPublicId === friendId || data.userPublicId === userPublicId) {
              onOnlineStatus(data.isOnline)
            }
            return
          }
          // switch (data.type) {
          //   case "NEW_MESSAGE":
          //     if (data.userPublicId === friendId || data.senderPublicId === friendId) {
          //       const newMessage: DirectMessageResponse = {
          //         id: data.payload.id,
          //         content: data.payload.content,
          //         is_read: data.payload.is_read,
          //         isOwn: data.payload.isOwn,
          //         created_at: data.payload.created_at,
          //         sender: data.payload.sender
          //       }
          //       onNewMessage(newMessage)
          //     }
          //     break;
          //   case "online_status":
          //     console.log({ data })
          //     if (data.userPublicId === friendId || data.userPublicId === userPublicId) {
          //       onOnlineStatus({ [data.userPublicId]: data.isOnline })
          //     }
          //     break;
          //
          // }
        } catch (error) {
          console.error("Error parsing Websocket message: ", error)
        }
      }

      ws.onclose = () => {
        console.log("websocket disconnected, Reconnecting...")

        setTimeout(connect, 3000)
      }

      ws.onerror = (error) => {
        console.log("Websocket error: ", error)
      }

      // Heartbeat to keep connecting alive 
      // const heartBeat = setInterval(() => {
      //   if (ws.readyState === WebSocket.OPEN) {
      //     ws.send("ping")
      //   }
      // }, 3000)
      //
      // return () => clearInterval(heartBeat)
    }

    connect()

    return () => {
      wsRef.current?.close()
    }
  }, [ENV.WS_URL, friendId, revalidator])

  return null
}
