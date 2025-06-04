import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoutes } from "./interfaces/http/routes/auth.route";
import { prettyJSON } from "hono/pretty-json";
import { friendshipRoutes } from "./interfaces/http/routes/friendship.route";

const app = new Hono();

app.use("*", prettyJSON());
app.use(logger());
app.route("/api/auth", authRoutes);
app.route("/api", friendshipRoutes);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: process.env.PORT || "3000",
  fetch: app.fetch,
  watch: process.env.NODE_ENV === "development",
  smol: true,
  tsconfig: "./tsconfig.json",
};

//export default app;
