import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/login.jsx";
import LandingPage from "./Components/Landing.jsx";

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
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
