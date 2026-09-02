import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/login";
import LandingPage from "./Components/landingPage";
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
    ],
  },
]);export default function App() {
  return <RouterProvider router={router} />;
}
