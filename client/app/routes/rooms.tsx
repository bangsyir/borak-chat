import { useEffect } from "react";
import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { ChatArea } from "~/components/chat-area";
import { useChatContext } from "~/components/chat-provider";

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
  const loaderData = useLoaderData();
  const { rooms, setRooms, roomsLoading, setRoomsLoading } = useChatContext();

  useEffect(() => {
    if (rooms.length === 0 && !roomsLoading) {
      setRoomsLoading(true);
      setRooms(loaderData.rooms);
      setRoomsLoading(false);
    }
  }, [rooms]);

  return <ChatArea />;
}
