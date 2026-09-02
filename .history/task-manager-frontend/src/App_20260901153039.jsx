import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";

// Main App Components
import Footer from "./Routes/Homepage/Footer";
import Header from "./Routes/Homepage/Header";
import HeroSection from "./Routes/Homepage/HeroSection";
import RecentEventsSection from "./Routes/Homepage/RecentEventsSection";
import CategoriesSection from "./Routes/Homepage/CategoriesSection";
import PopularEventsSection from "./Routes/Homepage/PopularEventsSection";
import TrendingOrganizersSection from "./Routes/Homepage/TrendingOrganizersSection";
import EventsPage from "./Routes/Events/EventsPage";
import Login from "./Routes/Login/login";
import Signup from "./Routes/signUp/signup";
import VerifyEmail from "./Routes/VerifyEmail/VerifyEmail";
import OtpVerify from "./Routes/ForgetPassword/otpVerify";
import ForgetPassword from "./Routes/ForgetPassword/forgetpassword";
import NewPassword from "./Routes/ForgetPassword/NewPassword";
import AdminLogin from "./AdminPanel/Login.jsx";
import EventDetail from "./Routes/EventDetail/EventDetail";
import ProfilePage from "./Routes/ProfilePage/ProfilePage.jsx";
import ProfilePageVisitor from "./Routes/ProfilePageVisitor/ProfilePageVisitor.jsx";
import EventFormWrapper from "./Routes/Form/event-form-wrapper.jsx";

// Admin Panel Components
import Layout from "./components/layout/Layout";
import Dashboard from "./AdminPanel/Dashboard";
import Organizers from "./AdminPanel/Organizers";
import Events from "./AdminPanel/Events";
import OrganizersSubmission from "./AdminPanel/OrganizersSubmission";
import EventsSubmission from "./AdminPanel/EventsSubmission";
import Admins from "./AdminPanel/Admins";

// Toast Provider
import { ToastProvider } from "./components/ui/Toast";

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  console.log("[ProtectedRoute] Rendering for path:", location.pathname);
  console.log("[ProtectedRoute] Auth state:", {
    requireAdmin,
    hasAdminToken: !!adminToken,
  });

  if (requireAdmin && !adminToken) {
    // Redirect to admin login if trying to access admin routes without token
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

// Root Layout for Main App
function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when the pathname changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

// Homepage Component
function Homepage() {
  return (
    <>
      <HeroSection />
      <RecentEventsSection />
      <CategoriesSection />
      <PopularEventsSection />
      <TrendingOrganizersSection />
    </>
  );
}

// Combined Router
export const router = createBrowserRouter([
  // Main Application Routes
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
    ],
  },

  // Routes without Header and Footer
  
  {
    path: "/event/:eventId",
    element: <EventDetail />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/visitor/:organizerId",
    element: <ProfilePageVisitor />,
  },
  {
    path: "/form",
    element: <EventFormWrapper />,
  },

  // Authentication Routes (also without header/footer)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verifyemail",
    element: <VerifyEmail />,
  },
  {
    path: "/forgotpassword",
    element: <ForgetPassword />,
  },
  {
    path: "/otpverify",
    element: <OtpVerify />,
  },
  {
    path: "/newpassword",
    element: <NewPassword />,
  },

  // Admin Panel Routes (using ProtectedRoute and Layout)
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "organizers",
        element: <Organizers />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "organizers-submission",
        element: <OrganizersSubmission />,
      },
      {
        path: "events-submission",
        element: <EventsSubmission />,
      },
      {
        path: "admins",
        element: <Admins />,
      },
    ],
  },

  // Catch all route - redirect to home (Optional - can be adjusted)
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

// Main App Component
export default function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}