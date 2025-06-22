import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoutes } from "./interfaces/http/routes/auth.route";
import { prettyJSON } from "hono/pretty-json";
import { friendshipRoutes } from "./interfaces/http/routes/friendship.route";
import { messagesRoutes } from "./interfaces/http/routes/messages.route";
import { roomsRoutes } from "./interfaces/http/routes/rooms.route";
import { HTTPException } from "hono/http-exception";
import { wsHadler, wsRouter } from "./interfaces/http/routes/ws.route";

const app = new Hono();

// global error
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status,
    );
  }
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500,
  );
});

app.use("*", prettyJSON());
app.use(logger());
app.route("/api/auth", authRoutes);
app.route("/api", friendshipRoutes);
app.route("/api", messagesRoutes);
app.route("/api", roomsRoutes);
app.route("/ws", wsRouter);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: process.env.PORT || "3000",
  fetch: app.fetch,
  websocket: wsHadler,
  watch: process.env.NODE_ENV === "development",
  smol: true,
  tsconfig: "./tsconfig.json",
};
