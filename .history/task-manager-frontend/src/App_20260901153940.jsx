import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "login",
        element: <div>Login</div>,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
