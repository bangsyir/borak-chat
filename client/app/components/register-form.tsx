import type React from "react";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, Link } from "react-router";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <span>
                Please create an account
              </span>
              <ModeToggle />
            </div>

          </CardTitle>
          <CardDescription>
            Let's join to borak chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="username" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">Login</Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              have an account?{" "}
              <Link to={"/login"} className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
