import { useState } from "react";
import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { ChatArea } from "~/components/chat-area";
import { ChatSidebar } from "~/components/chat-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession } = await import("~/lib/session.server");
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("__session")) {
    return redirect("/login");
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.get("__session").token}`,
    },
  });

  const result = await response.json();

  const friends = result.data.map((item: any) => ({
    id: item.publicId,
    name: item.username,
    avatar: "",
    isOnline: false,
    lastSeen: "2 hours ago",
  }));

  return { friends: friends };
}
export default function DirectMessagesPage() {
  const { friends } = useLoaderData();
  // const [activeChat, setActiveChat] = useState<{
  //   type: "direct" | "room";
  //   id: string;
  //   name: string;
  // } | null>(null);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ChatSidebar
          // activeChat={activeChat}
          // onChatSelect={setActiveChat}
          friends={friends}
          rooms={[]}
          activeTab="direct"
        />
        <ChatArea />
      </div>
    </SidebarProvider>
  );
}
