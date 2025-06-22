import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { verify } from "hono/jwt";
import {
  addConnection,
  removeConnection,
} from "../../../infrastructure/ws/websocketManager";
import { normalizeWebSocket } from "../../../shared/utils/websocket";

type JwtPayload = {
  sub: number;
  publicId: string;
};

type Variables = {
  user: JwtPayload;
};
const app = new Hono<{ Variables: Variables }>();
const { upgradeWebSocket, websocket } = createBunWebSocket<{
  userId: string;
}>();

app.use("/", async (c, next) => {
  const token = c.req.query("token");
  if (!token) return c.text("Unauthorized", 401);
  const validToken = (await verify(token, Bun.env.JWT_SECRET!)) as JwtPayload;
  if (!validToken) return c.text("Unauthorized", 401);
  c.set("user", { sub: validToken.sub, publicId: validToken.publicId });
  await next();
});

app.get(
  "/",
  upgradeWebSocket(async (c) => {
    const url = new URL(c.req.url);
    const token = url.searchParams.get("token");
    if (!token) throw new Error("Invalid token");
    const user = (await verify(token, Bun.env.JWT_SECRET!)) as JwtPayload;

    return {
      onOpen(_event, ws) {
        const userId = user.publicId;
        const normalizedWs = normalizeWebSocket(ws);
        addConnection(userId, normalizedWs);
      },
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send("Hello from server");
      },
      onClose(ws) {
        const normalizedWs = normalizeWebSocket(ws);
        removeConnection(user.publicId, normalizedWs);
        console.log(`Websocket disconnected for user: ${user.publicId}`);
      },
      onError(error) {
        console.error(`Websocket error for user ${user.publicId}: `, error);
      },
    };
  }),
);

export const wsRouter = app;
export const wsHadler = websocket;

//wsRoute.get("/ws", async (c) => {
//  const token = c.req.query("token");
//  if (!token) {
//    return c.text("Unauthorized", 401);
//  }
//  try {
//    const payload = await verify(token, Bun.env.JWT_SECRET!);
//    if (payload.sub === undefined || payload.publicId === undefined) {
//      return c.text("Invalid Credentials", 401);
//    }
//    // perform the actual upgrade
//    return new Response(null, { status: 101 });
//  } catch (error) {
//    console.error("Websocket auth error: ", error);
//    return c.text("Authentication failed", 401);
//  }
//});

//export const websocketHandlers = {
//  open: (ws: ServerWebSocket<{ userId: string }>) => {
//    console.log(`Websocket opened for user: ${ws.data.userId}`);
//    addConnection(ws.data.userId, ws);
//  },
//  close: (ws: ServerWebSocket<{ userId: string }>) => {
//    console.log(`WebSocket closed for user : ${ws.data.userId}`);
//    removeConnection(ws.data.userId, ws);
//  },
//  message: (
//    ws: ServerWebSocket<{ userId: string }>,
//    message: string | Buffer,
//  ) => {
//    console.log(`Message from ${ws.data.userId}:${message}`);
//    if (message.toString() === "ping") {
//      ws.send("pong");
//    }
//  },
//  drain: (ws: ServerWebSocket<{ userId: string }>) => {
//    console.log(`Websocket drain for user: ${ws.data.userId}`);
//  },
//  error: (ws: ServerWebSocket<{ userId: string }>, error: Error) => {
//    console.error(`Websocket error for ${ws.data.userId} :`, error);
//  },
//};
