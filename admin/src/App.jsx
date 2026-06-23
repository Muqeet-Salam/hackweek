import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminLayout from "./pages/AdminLayout";
import AdminChallenges from "./pages/AdminChallenges";
import AdminSubmissions from "./pages/AdminSubmissions";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminAccess from "./pages/AdminAccess";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AdminLogin />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/challenges" replace /> },
      { path: "challenges", element: <AdminChallenges /> },
      { path: "submissions", element: <AdminSubmissions /> },
      { path: "registrations", element: <AdminRegistrations /> },
      { path: "admins", element: <AdminAccess /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
