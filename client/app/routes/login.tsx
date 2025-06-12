import { LoginForm } from "~/components/login-form";
import type { Route } from "./+types/login";
import React from "react";
import { toast } from "sonner";
import { data, redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const { getSession, destroySession } = await import("~/lib/session.server");
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("__session")) {
    return redirect("/");
  }
  return data(
    {
      success: false,
      message: session.get("error"),
    },
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    },
  );
}

export async function action({ request }: Route.ActionArgs) {
  const { commitSession, getSession } = await import("~/lib/session.server");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const session = await getSession(request.headers.get("Cookie"));

  let formData = await request.formData();

  const username = formData.get("username");
  const password = formData.get("password");
  const body = {
    username,
    password,
  };
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (!result.success) {
    return result;
  }
  const sessionToken = { token: result.data.token };
  session.set("__session", sessionToken);
  const setCookie = await commitSession(session);
  return data(result, {
    headers: { "Set-Cookie": setCookie },
  });
}

export default function Login({ actionData }: Route.ComponentProps) {
  React.useEffect(() => {
    if (actionData?.success === false) {
      toast("Opss somthing wrong", {
        description: actionData.message,
        position: "top-center",
      });
    }
  }, [actionData]);
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p10">
      <div className="w-full max-w-sm">
        <LoginForm actiondata={actionData} />
      </div>
    </div>
  );
}
