import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { ChatArea } from "~/components/chat-area";
import { ChatSidebar } from "~/components/chat-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

// Mock data for rooms
export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession } = await import("~/lib/session.server");
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("__session")) {
    return redirect("/login");
  }
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.get("__session").token}`,
    },
  });
  const result = await response.json();
  return { rooms: result.data };
}
export default function RoomsRoute() {
  const { rooms } = useLoaderData();
 
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ChatSidebar
          friends={[]}
          rooms={rooms}
          activeTab="rooms"
        />
        <ChatArea />
      </div>
    </SidebarProvider>
  );
}
