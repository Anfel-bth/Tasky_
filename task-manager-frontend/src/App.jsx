import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/login.jsx";
import LandingPage from "./Components/Landing.jsx";
import Dashboard from "./Components/dashboard.jsx";
import Register from "./Components/register.jsx";
import VerifyCode from "./Components/verifyotp.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "verifyotp",
        element: <VerifyCode />,
      },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
