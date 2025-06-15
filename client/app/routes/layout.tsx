import { Outlet, type LoaderFunctionArgs } from "react-router";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { SiteHeader } from "~/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getUser } = await import("~/lib/session.server");
  const user = await getUser(request);
  return { user };
}

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
