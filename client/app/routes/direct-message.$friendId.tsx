import { MessageSquare, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { useWebSocketContext } from "~/components/chat-websocket";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Textarea } from "~/components/ui/textarea";
import { useLayoutData } from "~/hooks/use-layout-data";
import { useMessagesStore } from "~/hooks/use-messages-store";
import { useOnlineStatusStore } from "~/hooks/use-online-status-store";
import { useTypingStore } from "~/hooks/use-typing-store";
import { DateFormatDistance } from "~/lib/date-format";
import { cn } from "~/lib/utils";

export type DirectMessageResponse = {
  id: number;
  content: string;
  isRead: boolean;
  isOwn: boolean;
  createdAt: Date;
  sender: string;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { authUser } = await import("~/lib/session.server");
  const { token } = await authUser(request);
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
  const WS_URL = `ws://192.168.0.12:3000/ws?token=${token}`;
  const result = await response.json();
  return {
    ...result,
    friendId: friendId,
    ENV: { WS_URL },
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { authUser } = await import("~/lib/session.server");
  const { token } = await authUser(request);

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

  const messages = useMessagesStore((state) => state.messages);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const addMessage = useMessagesStore((state) => state.addMessage);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const friendStatus = useOnlineStatusStore((state) =>
    state.getStatus(friendId),
  );
  const isTyping = useTypingStore((state) => state.typingStatus[friendId]);

  const layoutData = useLayoutData();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // instant scroll to bottom (animation)
  const scrollToBottomInstant = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
  };
  // smooth scroll to bottom (with animation) - only for new messages
  const scrollToBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  // load messages when activechat change
  useEffect(() => {
    setMessages(data.messages);
    // setIsInitialLoad(true);
  }, [data.messages]);

  // handle scrolling base on context
  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId1 = setTimeout(() => {
        scrollToBottomInstant();
      }, 0);
      const timeoutId2 = setTimeout(() => {
        scrollToBottomInstant();
        // setIsInitialLoad(false);
      }, 100);
      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
      };
    }
  }, [messages, isInitialLoad]);

  // handle component mount (page refresh)
  useEffect(() => {
    setIsInitialLoad(true);
  }, []);

  const handleSend = (content: string) => {
    const tempId = Date.now();
    const optomisticMessage = {
      id: tempId,
      content,
      isRead: false,
      isOwn: true,
      createdAt: new Date(),
      sender: layoutData.user.data.username,
    };

    // add immediatlety to UI
    addMessage(optomisticMessage);

    setTimeout(() => {
      scrollToBottomSmooth();
    }, 50);
  };

  const handleInputFocus = () => {
    // Scroll to bottom when input is focused (mobile keyboard appears)
    setTimeout(() => {
      scrollToBottomSmooth();
    }, 300);
  };

  return (
    <div className="relative flex flex-col">
      <div className="relative w-full flex-shrink-0">
        {/* Chat Header */}
        <header className="fixed top-0 z-50 flex w-full items-center gap-2 border-b bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger />
          <div className="mx-1 h-8 border-r" />
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {data.friendName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <h2 className="font-semibold">{data.friendName}</h2>
              {friendStatus?.isInThisChat ? (
                <div className="flex h-2 w-2 flex-1 rounded-full bg-green-500"></div>
              ) : friendStatus?.isOnline ? (
                <div className="flex h-2 w-2 flex-1 rounded-full bg-yellow-500"></div>
              ) : (
                <div className="flex h-2 w-2 flex-1 rounded-full bg-gray-500"></div>
              )}
              {isTyping && (
                <span className="text-sm text-gray-500">is typing...</span>
              )}
            </div>
          </div>
        </header>
      </div>
      {/* Messages Area */}
      <div className="relative flex h-full flex-col items-center">
        <ScrollArea className="flex h-dvh w-full flex-col items-center overflow-x-hidden overflow-y-auto p-3 sm:p-4">
          <div className="relative flex flex-col items-center space-y-4 p-4">
            {/* Welcome message */}
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {`This is the beginning of your conversation with ${data.friendName}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                Send a message to start the conversation
              </p>
            </div>

            {/* Sample messages - replace with real messages */}

            <div className="flex w-full flex-col space-y-4 lg:w-1/2">
              {messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${message.isOwn ? "order-2" : "order-1"}`}
                  >
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p
                      className={`mt-1 px-3 text-xs text-muted-foreground ${message.isOwn ? "text-end" : "text-start"}`}
                    >
                      {DateFormatDistance(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} className="h-px pb-18" />
            </div>
          </div>
        </ScrollArea>
        {/* Message Input */}
        <div className="absolute inset-x-0 bottom-0 z-40">
          <MessageInput
            friendName={data.friendName}
            friendId={friendId}
            onSend={handleSend}
            onInputFocus={handleInputFocus}
          />
        </div>
      </div>
    </div>
  );
}

function MessageInput({
  friendName,
  friendId,
  onSend,
  onInputFocus,
}: {
  friendName: string;
  friendId: string;
  onSend: (value: string) => void;
  onInputFocus: () => void;
}) {
  const [message, setMessage] = useState("");
  const fetcher = useFetcher();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const typingRef = useRef<boolean>(false);
  const { send } = useWebSocketContext();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && fetcher.data.success) {
      setMessage("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // start typing notification
    if (!typingRef.current) {
      typingRef.current = true;
      send({
        type: "typing_start",
        payload: { targetPublicId: friendId },
      });
    }
    if (value.length === 0) {
      send({
        type: "typing_stop",
        payload: { targetPublicId: friendId },
      });
    }
    // reset typing timeout
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      typingRef.current = false;
      if (value.length > 0) {
        send({
          type: "typing_stop",
          payload: { targetPublicId: friendId },
        });
      }
    }, 2000); // 2s delay after last keystroke
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      { content: message },
      { method: "post", action: `/direct-message/${friendId}` },
    );
    onSend(message);
    // clear typing status
    send({
      type: "typing_stop",
      payload: { targetPublicId: friendId },
    });
    setMessage("");
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // check if enter key was press
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative mb-3 flex w-full items-center justify-center lg:mb-0">
      <div className="w-full rounded-2xl p-3 backdrop-blur supports-[backdrop-filter]:bg-foreground/20 sm:p-4 lg:w-1/2">
        <fetcher.Form onSubmit={handleSubmit}>
          <div className="relative">
            <Textarea
              ref={inputRef}
              id="content"
              name="content"
              placeholder={`Message ${friendName}...`}
              value={message}
              onChange={handleInputChange}
              onFocus={onInputFocus}
              className={cn("pr-20")}
              autoComplete="off"
              onKeyDown={handleKeyDown}
              disabled={fetcher.state === "submitting"}
            />
            <div className="absolute top-1/2 right-2 flex -translate-y-1/2 transform gap-1">
              <Button
                size="icon"
                className="h-8 w-8"
                type="submit"
                disabled={fetcher.state === "submitting"}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
