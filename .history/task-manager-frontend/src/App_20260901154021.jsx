import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "C:\Users\dell\Desktop\task-manager\task-manager-frontend\src\Components\login.jsx";

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
