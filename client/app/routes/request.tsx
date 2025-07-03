import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function RequestPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-3">
        <div className="relative flex items-center gap-3">
          <SidebarTrigger />
          <div className="mx-1 h-8 border-r" />
          <h2 className="font-semibold">Request</h2>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-col items-center px-8 pt-4">
        {/* header  */}
        <div className="py-4">
          <div className="rounded-xl bg-gray-700/50 p-2">
            <h3 className="font-semibold">Incoming Friend Request</h3>
          </div>
        </div>
        <div className="mx-auto flex w-full items-center justify-center space-y-4">
          <div className="flex w-full flex-col items-center gap-4 lg:w-1/2">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div>testname</div>
                <small>{new Date().toDateString()}</small>
              </div>
              <div>
                <Button
                  variant="ghost"
                  className="cursor-pointer text-green-500 hover:text-green-700"
                >
                  <CircleCheck className="h-10 w-10" />
                </Button>
                <Button
                  variant="ghost"
                  className="cursor-pointer text-red-500 hover:text-red-700"
                >
                  <CircleX className="h-10 w-10" />
                </Button>
              </div>
            </div>

            <Separator className="my-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
