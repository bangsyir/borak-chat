import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { getSession } = await import("~/lib/session.server");
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("__session")) {
    return redirect("/login");
  }
  return {};
}

export default function Home() {
  return <Welcome />;
}
