import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import Register from "../pages/Register.jsx";
import Profile from "../pages/Profile.jsx";
import Challenges from "../pages/Challenges.jsx";
import Submissions from "../pages/Submissions.jsx";
import Leaderboard from "../pages/Leaderboard.jsx";
import Rules from "../pages/Rules.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: (<ProtectedRoute><Dashboard /></ProtectedRoute>), },
      { path: "register", element: (<Register />), },
      { path: "profile", element: (<ProtectedRoute><Profile /></ProtectedRoute>), },
      { path: "challenges", element: (<ProtectedRoute><Challenges /></ProtectedRoute>), },
      { path: "submissions", element: (<ProtectedRoute><Submissions /></ProtectedRoute>), },
      { path: "leaderboard", element: (<ProtectedRoute><Leaderboard /></ProtectedRoute>), },
      { path: "rules", element: <Rules />, },
    ],
  },
]);