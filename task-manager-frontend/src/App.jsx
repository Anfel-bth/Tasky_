// // import { createBrowserRouter, RouterProvider } from "react-router-dom";
// // import Login from "./Components/login.jsx";
// // import LandingPage from "./Components/Landing.jsx";
// // import Register from "./Components/register.jsx";
// // import VerifyCode from "./Components/verifyotp.jsx";
// // import Inbox from "./Components/inbox.jsx";
// // import Layout from "./Layout/Layout.jsx";
// // import AddTask from "./Components/addtask.jsx"; 

// // const router = createBrowserRouter([
// //   {
// //     path: "/",
// //     children: [
// //       {
// //         index: true,
// //         element: <LandingPage />,
// //       },
// //       {
// //         path: "login",
// //         element: <Login />,
// //       },
// //       {
// //         path: "dashboard",
// //         element: <Layout />,
// //         children: [
// //           { index: true, element: <Inbox /> },
// //           // { path: "today", element: <Today /> },
// //           // { path: "upcoming", element: <Upcoming /> },
// //         ],
// //       },
// //       {
// //         path: "register",
// //         element: <Register />,
// //       },
// //       {
// //         path: "dashboard/addtask",
// //         element: <AddTask />,
// //       },
// //       {
// //         path: "verifyotp",
// //         element: <VerifyCode />,
// //       },
// //     ],
// //   },
// // ]);
// // export default function App() {
// //   return <RouterProvider router={router} />;
// // }
// // src/App.jsx

// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";

// import Login from "./Components/login.jsx";
// import LandingPage from "./Components/Landing.jsx";
// import Register from "./Components/register.jsx";
// import VerifyCode from "./Components/verifyotp.jsx";
// import Inbox from "./Components/inbox.jsx";

// import Layout from "./Layout/Layout.jsx";

// const router = createBrowserRouter([
//   {
//     path: "/",

//     children: [
//       /* ================= LANDING PAGE ================= */

//       {
//         index: true,
//         element: <LandingPage />,
//       },

//       /* ================= LOGIN ================= */

//       {
//         path: "login",
//         element: <Login />,
//       },

//       /* ================= DASHBOARD ================= */

//       {
//         path: "dashboard",

//         element: <Layout />,

//         children: [
//           /* Inbox */

//           {
//             index: true,
//             element: <Inbox />,
//           },

//           /*
//           Add these later when you create
//           Today.jsx and Upcoming.jsx:

//           {
//             path: "today",
//             element: <Today />,
//           },

//           {
//             path: "upcoming",
//             element: <Upcoming />,
//           },
//           */
//         ],
//       },

//       /* ================= REGISTER ================= */

//       {
//         path: "register",
//         element: <Register />,
//       },

//       /* ================= VERIFY OTP ================= */

//       {
//         path: "verifyotp",
//         element: <VerifyCode />,
//       },
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;
// src/App.jsx

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Login from "./Components/login.jsx";
import LandingPage from "./Components/Landing.jsx";
import Register from "./Components/register.jsx";
import VerifyCode from "./Components/verifyotp.jsx";
import Inbox from "./Components/inbox.jsx";
import Today from "./Components/today.jsx";
import Upcoming from "./Components/upcoming.jsx";

import Layout from "./Layout/Layout.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const router = createBrowserRouter([
  {
    path: "/",

    children: [
      /* ================= LANDING PAGE ================= */
      {
        index: true,
        element: <LandingPage />,
      },

      /* ================= LOGIN ================= */
      {
        path: "login",
        element: <Login />,
      },

      /* ================= DASHBOARD ================= */
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <Layout />
          </RequireAuth>
        ),

        children: [
          { index: true, element: <Inbox /> },
          { path: "today", element: <Today /> },
          { path: "upcoming", element: <Upcoming /> },
        ],
      },

      /* ================= REGISTER ================= */
      {
        path: "register",
        element: <Register />,
      },

      /* ================= VERIFY OTP ================= */
      {
        path: "verifyotp",
        element: <VerifyCode />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;