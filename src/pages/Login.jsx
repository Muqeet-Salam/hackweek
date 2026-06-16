import Button from "../components/ui/Button";
import { loginWithGitHub } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authstore";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 1. GitHub OAuth login (creates Firebase session)
      const result = await loginWithGitHub();
      const user = result.user;

      // 2. Check Firestore registration
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      // ❌ NOT REGISTERED → destroy session + redirect
      if (!snap.exists()) {
        await signOut(auth);
        navigate("/register");
        return;
      }

      // ✅ REGISTERED USER
      const data = snap.data();

      setUser(user);
      setProfile(data);

      navigate("/dashboard");

    } catch (err) {
      console.log("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="border-4 border-black bg-[#00B7FF] p-8 shadow-[10px_10px_0_black]">

          <p className="font-black text-sm tracking-[0.3em]">
            COSC PRESENTS
          </p>

          <h1 className="text-6xl font-extrabold mt-4">
            HACKWEEK
            <br />
            2026
          </h1>

          <p className="mt-6 text-lg font-bold">
            July 6 - July 12
          </p>

          <p className="mt-3 font-medium">
            One week of coding challenges,
            open source contributions,
            leaderboards and rewards.
          </p>

          <div className="mt-8 space-y-3 font-bold">
            <p>✓ Daily Challenges</p>
            <p>✓ Open Source Tracks</p>
            <p>✓ Public Profiles</p>
            <p>✓ Certificates & Rewards</p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="border-4 border-black bg-white p-8 shadow-[10px_10px_0_black] flex flex-col justify-center">

          <h2 className="text-4xl font-extrabold">
            Login
          </h2>

          <p className="mt-3 font-medium">
            Sign in with GitHub to access
            your HackWeek dashboard.
          </p>

          <div className="mt-8">
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Checking..."
                : "Continue with GitHub"}
            </Button>
          </div>

          <p className="mt-4 text-sm font-medium">
            New participant?
            Register first before logging in.
          </p>

        </div>

      </div>
    </div>
  );
}