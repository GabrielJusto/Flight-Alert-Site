import { createBrowserRouter } from "react-router";
import { AuthPage } from "./components/auth-page";
import { Dashboard } from "./components/dashboard";
import { RouteDetails } from "./components/route-details";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthPage,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/route/:routeId",
    Component: RouteDetails,
  },
]);
