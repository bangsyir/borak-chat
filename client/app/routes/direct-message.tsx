import { useEffect } from "react";
import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { useChatContext } from "~/components/chat-provider";
import { ChatWelcome } from "~/components/chat-welcome";

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
  const dataLoader = useLoaderData();
  const { friends, setFriends, friendsLoading, setFriendsLoading } =
    useChatContext();
  useEffect(() => {
    if (friends.length === 0 && !friendsLoading) {
      setFriendsLoading(true);
      setFriends(dataLoader.friends);
      setFriendsLoading(false);
    }
  }, [friends]);

  return <ChatWelcome />;
}
