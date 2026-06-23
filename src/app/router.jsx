import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import Register from "../pages/Register.jsx";
import Profile from "../pages/Profile.jsx";
import ChallengesList from "../pages/Challenges/ChallengesList.jsx";
import ChallengeDetail from "../pages/Challenges/ChallengeDetail.jsx";
import Leaderboard from "../pages/Leaderboard.jsx";

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
      { path: "challenges", element: <ChallengesList /> },
      { path: "challenges/:slug", element: <ChallengeDetail /> },
      { path: "leaderboard", element: <Leaderboard /> },
    ],
  },
]);