import { MessageSquare, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { ChatwebSocket } from "~/components/chat-websocket";
import { ModeToggle } from "~/components/mode-toggle";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { useLayoutData } from "~/hooks/use-layout-data";
import { useAutoScroll } from "~/hooks/use-scrollable";
import { getSession } from "~/lib/session.server";

export type DirectMessageResponse = {
  id: number;
  content: string;
  is_read: boolean;
  isOwn: boolean;
  created_at: Date;
  sender: string;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = await session.get("__session").token;
  const friendId = params.friendId;

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/messages/direct/${friendId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const WS_URL = `ws://localhost:3000/ws?token=${token}`
  const result = await response.json();
  return {
    ...result,
    friendId: friendId,
    ENV: { WS_URL }
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = await session.get("__session").token;
  const friendId = params.friendId;

  const formData = await request.formData();
  const content = formData.get("content");

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/messages/direct/${friendId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    },
  );
  const result = await response.json();
  return result;
}

export default function DirectMessageFriend() {
  const { data, friendId } = useLoaderData();
  const [messages, setMessages] = useState<DirectMessageResponse[]>(data.messages)
  const [onlineStatus, setOnlineStatus] = useState<boolean>(false)
  const messagesEndRef = useAutoScroll(messages)
  const layoutData = useLayoutData()

  const handleNewMessage = (newMessage: DirectMessageResponse) => {
    setMessages(prev => {
      if (prev.some(msg => msg.id === newMessage.id)) return prev
      return [...prev, newMessage]
    })
  }

  const handleSend = (content: string) => {
    const tempId = Date.now()
    const optomisticMessage = {
      id: tempId,
      content,
      is_read: false,
      isOwn: true,
      created_at: new Date(),
      sender: layoutData.data.username
    }

    // add immediatlety to UI 
    setMessages(prev => {
      if (prev.some(msg => msg.id === optomisticMessage.id)) return prev
      return [...prev, optomisticMessage]
    })
  }

  return (
    <div className="flex flex-1 flex-col h-screen">
      <ChatwebSocket userPublicId={layoutData.data.public_id} onNewMessage={handleNewMessage} onOnlineStatus={setOnlineStatus} />
      {/* Chat Header */}
      <header className="border-b border-border p-3 flex items-center justify-between flex-shrink-0 bg-backgrond">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {data.friendName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{data.friendName}</h2>
              {onlineStatus === true ? (
                <p className="text-xs text-green-500">Online</p>
              ) : (
                <p className="text-xs text-muted-foreground">Offline</p>

              )}
            </div>
          </div>
        </div>
        <ModeToggle />
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Welcome message */}
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {`This is the beginning of your conversation with ${data.friendName}`}
            </h3>
            <p className="text-muted-foreground text-sm">
              Send a message to start the conversation
            </p>
          </div>

          {/* Sample messages - replace with real messages */}

          <div className="space-y-4">
            {messages.map((message: any) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${message.isOwn ? "order-2" : "order-1"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg ${message.isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-3">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {/* Message Input */}
      <MessageInput friendName={data.friendName} friendId={friendId} onSend={handleSend} />
    </div>
  );
}

function MessageInput({ friendName, friendId, onSend }: { friendName: string, friendId: string, onSend: (value: string) => void }) {
  const [message, setMessage] = useState("")
  const fetcher = useFetcher()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && fetcher.data.success) {
      setMessage("")
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [fetcher.state, fetcher.data])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetcher.submit({ content: message }, { method: "post", action: `/direct-message/${friendId}` })
    onSend(message)
  }

  return (
    <div className="border-t border-border p-4 flex-shrink-0 bg-backgrond sticky bottom-0">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <fetcher.Form onSubmit={handleSubmit}>
            <Input
              ref={inputRef}
              id="content"
              name="content"
              placeholder={`Message ${friendName}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button size="icon" className="h-8 w-8" type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </fetcher.Form>
        </div>
      </div>
    </div>

  )
}
