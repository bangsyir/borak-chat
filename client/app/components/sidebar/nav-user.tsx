import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import React, { useRef } from "react";
import { toast } from "sonner";
import { ChevronsUpDown, LogOutIcon, UserCircleIcon } from "lucide-react";
import type { loader } from "~/routes/layout";

export function NavUser({
  user,
}: {
  user: {
    username: string;
    email: string;
    avatar: string;
  };
}) {
  const actionData = useLoaderData<typeof loader>();
  const { isMobile } = useSidebar();

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const hasDisplayToast = useRef(false);

  React.useEffect(() => {
    if (fetcher?.data?.success === false) {
      toast.error("Opsss Something wrong with this apps");
      hasDisplayToast.current = true;
    }

    if (fetcher?.data?.success === true) {
      toast.success("You are logged out.", {
        description: "See you soon. we waiting for you",
      });
      hasDisplayToast.current = true;
      navigate("/login");
    }
  }, [fetcher.data]);

  function handleLogout() {
    fetcher.submit({}, { method: "post", action: "/logout" });
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={actionData.user.username} />
                <AvatarFallback className="rounded-lg uppercase">
                  {actionData.user.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {actionData.user.username}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {actionData.user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar}
                    alt={actionData.user?.username}
                  />
                  <AvatarFallback className="rounded-lg uppercase">
                    {actionData.user.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {actionData.user.username}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {actionData.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOutIcon className="text-red-400" />
                <button type="submit">Logout</button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
