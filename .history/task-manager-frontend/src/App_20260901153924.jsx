import { createBrowserRouter, RouterProvider } from "react-router-dom";
impo

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
