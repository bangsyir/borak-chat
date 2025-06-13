import React, { useRef } from "react";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Loader2Icon } from "lucide-react";
import { Link, useFetcher } from "react-router";
import { toast } from "sonner";

export type LoginFormProps = {
  actiondata: {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
  };
} & React.ComponentProps<"div">;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const fetcher = useFetcher();
  const hasDisplayToast = useRef(false);
  React.useEffect(() => {
    if (fetcher?.data?.success === true) {
      toast.success("Login Success", {
        description: "welcome back, nice to see you again.",
      });
      hasDisplayToast.current = true;
    }
  }, [fetcher.data]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <span>Welcome back</span>
              <ModeToggle />
            </div>
          </CardTitle>
          <CardDescription>login to your borak account</CardDescription>
        </CardHeader>
        <CardContent>
          {fetcher?.data?.success === false && (
            <Alert
              variant={"destructive"}
              className="mb-6"
              hidden={fetcher?.data?.success === true}
            >
              <AlertCircle />
              <AlertTitle>Unable to process the login</AlertTitle>
              <AlertDescription>{fetcher?.data?.message}</AlertDescription>
            </Alert>
          )}
          <fetcher.Form method="post">
            <div className="flex flex-col gap-4">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <div className="flex flex-col">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    required
                  />
                  <small className="text-red-500 pl-1">
                    {fetcher?.data?.success === false
                      ? fetcher?.data?.errors?.username
                      : ""}
                  </small>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="flex item-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to={""}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot Password
                  </Link>
                </div>
                <div className="flex flex-col">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                  />
                  <small className="text-red-500 pl-1">
                    {" "}
                    {fetcher?.data?.success === false
                      ? fetcher?.data?.errors?.password
                      : ""}
                  </small>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={fetcher.state !== "idle"}
                >
                  {fetcher.state !== "idle" ? (
                    <>
                      <Loader2Icon className="animate-spin" /> Please wait
                    </>
                  ) : (
                    <>Login</>
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={"/register"} className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
