import { createCookieSessionStorage } from "react-router";

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

export async function getToken(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = await session.get("__session").token;
  return { session, token };
}
