import { MessageSquare, Paperclip, Send } from "lucide-react";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { ModeToggle } from "~/components/mode-toggle";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { getSession } from "~/lib/session.server";

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
  const result = await response.json();
  return { data: result.data };
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
  console.log({ result });
  return result;
}

export default function DirectMessageFriend() {
  const { data } = useLoaderData();
  const fetcher = useFetcher();
  return (
    <div className="flex flex-1 flex-col">
      {/* Chat Header */}
      <header className="border-b border-border p-3 flex items-center justify-between">
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
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>
        <ModeToggle />
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
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
            {data.messages.map((message: any) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${message.isOwn ? "order-2" : "order-1"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.isOwn
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
          </div>
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <fetcher.Form method="POST">
              <Input
                id="content"
                name="content"
                placeholder={`Message ${data.friendName}...`}
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
    </div>
  );
}
