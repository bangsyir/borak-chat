import { createCookieSessionStorage } from "react-router";
import { parseJwt } from "./jwt.server";

type UserType = {
  username: string;
  email: string;
};

const SESSION_SECRET = import.meta.env.VITE_SESSION_SECRET as string;
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets: [SESSION_SECRET],
      secure: import.meta.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };

export async function getUser(request: Request): Promise<UserType> {
  const session = await getSession(request.headers.get("Cookie"));
  const payload = await session.get("__session");
  return payload?.user;
}
