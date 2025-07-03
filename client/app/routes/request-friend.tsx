import { redirect, type ActionFunctionArgs } from "react-router";

interface RequestFriendResultType {
  success: boolean;
  message: string;
  errors?: {
    friendPublicId: string[];
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const { getSession } = await import("~/lib/session.server");
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("__session")) {
    return redirect("/login");
  }
  const formData = await request.formData();
  const friendPublicId = formData.get("friendPublicId");
  if (!friendPublicId || typeof friendPublicId !== "string") {
    return new Response(JSON.stringify({ error: "friend id is required" }), {
      status: 400,
    });
  }
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  const respose = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/friend-request`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.get("__session").token}`,
      },
      body: JSON.stringify({ friendPublicId }),
    },
  );
  const result: RequestFriendResultType = await respose.json();

  return { ...result };
}
