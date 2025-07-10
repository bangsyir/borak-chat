import { SidebarTrigger } from "~/components/ui/sidebar";
import type { Route } from "./+types/rooms.$roomId";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import React from "react";
import { useRoomMessagesStore } from "~/hooks/use-room-messages-store";
import { DateFormatDistance } from "~/lib/date-format";
import { ScrollArea } from "~/components/ui/scroll-area";
import { EllipsisVertical, MessageSquare, Send } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Await, useFetcher, useRouteLoaderData } from "react-router";
import { useLayoutData } from "~/hooks/use-layout-data";
import { useMessagesAutoScroll } from "~/hooks/use-scrollable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { authUser } = await import("~/lib/session.server");
  const { token } = await authUser(request);
  const roomId = params.roomId;

  const resposeMessages = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/rooms/${roomId}/messages`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const responseRoomMembers = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/rooms/${roomId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const resultRoomMembers = responseRoomMembers.json();
  const resultMessages = await resposeMessages.json();

  return { resultMessages, resultRoomMembers, roomId };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { authUser } = await import("~/lib/session.server");
  const { token } = await authUser(request);
  const roomId = params.roomId;

  const formData = await request.formData();
  const content = formData.get("content");

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/rooms/${roomId}/messages`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    },
  );
  const result = await response.json();
  return { result };
}

export default function RoomIdPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const setMessages = useRoomMessagesStore((state) => state.setMessages);
  const messages = useRoomMessagesStore((state) => state.messages);

  const { setIsInitialLoad, scrollToBottomSmooth, messagesEndRef } =
    useMessagesAutoScroll(messages);
  // handle component mount (page refresh)
  React.useEffect(() => {
    setIsInitialLoad(true);
  }, []);

  React.useEffect(() => {
    const scroll = setTimeout(() => {
      scrollToBottomSmooth();
    }, 50);
    return clearTimeout(scroll);
  }, [actionData?.result]);

  React.useEffect(() => {
    setMessages(loaderData.resultMessages.data.messages);
  }, [loaderData.resultMessages.data.messages]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex w-full items-center justify-between gap-2 border-b bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div className="mx-1 h-8 border-r" />
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs uppercase">
                {loaderData.resultMessages.data.room_name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <h2 className="font-semibold">
                {loaderData.resultMessages.data.room_name}
              </h2>
            </div>
          </div>
        </div>
        <ListMemberSheet />
      </header>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="flex h-dvh w-full flex-col items-center p-3 sm:p-4">
          <div className="relative flex flex-col items-center space-y-4 p-4">
            {/* Welcome message */}
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg">
                {`Let's start new conversation with ${loaderData.resultMessages.data.room_name} group`}
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
                  className={`flex ${message.is_own ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${message.isOwn ? "order-2" : "order-1"}`}
                  >
                    <p>{message.sender}</p>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.is_own
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p
                      className={`mt-1 px-3 text-xs text-muted-foreground ${message.is_own ? "text-end" : "text-start"}`}
                    >
                      {DateFormatDistance(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} className="h-px" />
            </div>
          </div>
        </ScrollArea>
      </div>
      <MessageInput
        roomName={loaderData.resultMessages.data.room_name}
        roomId={loaderData.roomId}
      />
    </div>
  );
}

function MessageInput({
  roomName,
  roomId,
}: {
  roomName: string;
  roomId: string;
}) {
  const [message, setMessage] = React.useState("");
  const fetcher = useFetcher();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const typingTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const addMessage = useRoomMessagesStore((state) => state.addMessage);
  const layoutData = useLayoutData();

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && fetcher.data.success) {
      setMessage("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMessage(e.currentTarget.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      { content: message },
      { method: "post", action: `/rooms/${roomId}` },
    );
    const tempId = Date.now();
    const optomisticMessage = {
      id: tempId,
      sender: layoutData.user.data.username,
      content: message,
      is_own: true,
      created_at: new Date(),
    };
    addMessage(optomisticMessage);

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
    <div className="mb-3 flex w-full items-center justify-center lg:mb-0">
      <div className="w-full rounded-2xl p-3 backdrop-blur supports-[backdrop-filter]:bg-foreground/20 sm:p-4 lg:w-1/2">
        <fetcher.Form onSubmit={handleSubmit}>
          <div className="relative">
            <Textarea
              id="content"
              name="content"
              placeholder={`Message in ${roomName}...`}
              value={message}
              onChange={handleInputChange}
              className={cn("pr-20")}
              onKeyDown={handleKeyDown}
              autoComplete="off"
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

function ListMemberSheet() {
  const { resultRoomMembers } = useRouteLoaderData("routes/rooms.$roomId");
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <EllipsisVertical />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Member List</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          <React.Suspense fallback="Loading...">
            <Await resolve={resultRoomMembers}>
              {(initialize) => (
                <>
                  {initialize.data.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted">
                        {item.username.slice(0, 2)}
                      </div>
                      <p>{item.username}</p>
                      <small className="rounded-full bg-green-700 px-1">
                        {item.isAdmin && "admin"}
                      </small>
                    </div>
                  ))}
                </>
              )}
            </Await>
          </React.Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}
