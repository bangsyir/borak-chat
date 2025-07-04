import {
  ArrowBigLeft,
  CheckCircle,
  CircleCheck,
  CircleX,
  Clock3,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Badge } from "~/components/ui/badge";
import {
  data,
  isRouteErrorResponse,
  Link,
  useParams,
  useRouteError,
} from "react-router";
import type { Route } from "./+types/request.$status";
import type React from "react";
import { cn } from "~/lib/utils";
import type { FriendRequestStatus } from "~/types/friendship";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { authUser } = await import("~/lib/session.server");
  const { token } = await authUser(request);
  const status = params.status as string;

  const requestStatus = ["incoming", "outgoing"];
  if (!requestStatus.includes(status)) {
    throw data(
      "Request record not found. available status just for incoming and outgoing only",
      {
        status: 404,
      },
    );
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/friend-request/${status}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const result: FriendRequestStatus = await response.json();

  return { ...result };
}

function StatusBage({
  status,
}: {
  status: string | "pending" | "accepted" | "rejected";
}) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary">
          <Clock3 />
          pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle />
          rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="default">
          <CheckCircle />
          accepted
        </Badge>
      );
  }
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <div>
        <div className="flex items-center justify-between border-b border-border p-3">
          <div className="relative flex items-center gap-3">
            <SidebarTrigger />
            <div className="mx-1 h-8 border-r" />
            <h2 className="font-semibold">Request</h2>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
export default function RequestPage({ loaderData }: Route.ComponentProps) {
  const params = useParams();
  return (
    <Layout>
      <div className="mx-auto flex w-full flex-col px-8 pt-4 lg:w-1/2">
        {/* header  */}
        <div className="flex">
          <div className="py-4">
            <div className="rounded-xl bg-gray-700/50 p-2">
              <h3 className="font-semibold capitalize">{`${params.status} Friend Request`}</h3>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full items-center justify-center space-y-4">
          {params.status === "incoming" && (
            <>
              {loaderData.data.length === 0 ? (
                <div>No Incoming List Found</div>
              ) : (
                loaderData.data.map((item, index) => (
                  <div
                    className="flex w-full flex-col items-center gap-4"
                    key={index}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex flex-col">
                        <div>{item.requester?.username}</div>
                        <small className="text-muted-foreground">
                          {new Date(item.createdAt).toDateString()}
                        </small>
                      </div>
                      <div className="flex items-center">
                        <StatusBage status={item.status} />
                        <Button
                          variant="ghost"
                          className="cursor-pointer hover:text-green-500"
                        >
                          <CircleCheck className="h-10 w-10" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="cursor-pointer hover:text-red-500"
                        >
                          <CircleX className="h-10 w-10" />
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-1" />
                  </div>
                ))
              )}
            </>
          )}
          {params.status === "outgoing" && (
            <>
              {loaderData.data.length === 0 ? (
                <div>No Outoing List Found</div>
              ) : (
                loaderData.data.map((item, index) => (
                  <div
                    className="flex w-full flex-col items-center gap-4"
                    key={index}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex flex-col">
                        <div>{item.requestee?.username}</div>
                        <small>{new Date().toDateString()}</small>
                      </div>
                      <div className="flex items-center">
                        <StatusBage status={item.status} />
                      </div>
                    </div>

                    <Separator className="my-1" />
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Layout>
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">
            {error.status} {error.statusText}
          </h1>
          <div className="flex flex-col items-center text-center">
            <p className="font-mono">{error.data}</p>
            <div className="flex justify-center">
              <Link
                to="/request/incoming"
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  }),
                )}
              >
                <ArrowBigLeft />
                Back
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  } else if (error instanceof Error) {
    return (
      <Layout>
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      </Layout>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
