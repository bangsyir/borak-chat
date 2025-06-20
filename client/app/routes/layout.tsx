import { data, Outlet, type LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const { destroySession, getToken } = await import("~/lib/session.server");
  const { session, token } = await getToken(request);
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (result.success === false) {
    return data(
      {},
      {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      },
    );
  }
  return result;
}

export default function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
