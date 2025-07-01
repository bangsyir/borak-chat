import { data, Outlet, type LoaderFunctionArgs } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { ChatProvider } from "~/components/chat-provider";
import { ChatwebSocketProvider } from "~/components/chat-websocket";
import { SidebarProvider } from "~/components/ui/sidebar";

export async function loader({ request }: LoaderFunctionArgs) {
  const { destroySession, getToken } = await import("~/lib/session.server");
  const { session, token } = await getToken(request);
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  const WS_URL = `ws://192.168.0.12:3000/ws?token=${token}`;
  if (result.success === false) {
    return data(
      {},
      {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      },
    );
  }
  return { user: result, WS_URL };
}

export default function Layout() {
  return (
    <ChatwebSocketProvider>
      <ChatProvider>
        <SidebarProvider>
          <div className="flex max-h-screen w-full bg-background">
            <AppSidebar />
            <main className="flex min-w-0 flex-1 flex-col">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </ChatProvider>
    </ChatwebSocketProvider>
  );
}
