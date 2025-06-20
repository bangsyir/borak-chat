import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/layout.tsx", [
    route("/direct-message", "routes/direct-message.tsx", [
      route(":friendId", "routes/direct-message.$friendId.tsx"),
    ]),
    route("/rooms", "routes/rooms.tsx"),
  ]),
  route("/login", "routes/login.tsx"),
  route("/set-theme", "routes/set-theme.ts"),
  route("/register", "routes/register.tsx"),
  route("/logout", "routes/logout.ts"),
] satisfies RouteConfig;
