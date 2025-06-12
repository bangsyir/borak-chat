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
