import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [index("routes/home.tsx")]),
  route("/login", "routes/login.tsx"),
  route("/set-theme", "routes/set-theme.ts"),
  route("/register", "routes/register.tsx"),
  route("/logout", "routes/logout.ts"),
] satisfies RouteConfig;
