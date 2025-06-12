import { RegisterForm } from "~/components/register-form";
import type { Route } from "./+types/register";
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

export default function Register() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
