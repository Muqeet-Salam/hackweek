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
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      // 1. GitHub OAuth login (creates Firebase session)
      const result = await loginWithGitHub();
      const user = result.user;

      // 2. Check Firestore registration
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      // ❌ NOT REGISTERED → destroy session + redirect
      if (!snap.exists()) {
        await signOut(auth);
        setError("Registrations are closed. This GitHub account is not registered.");
        return;
      }

      // ✅ REGISTERED USER
      const data = snap.data();

      setUser(user);
      setProfile(data);

      navigate("/dashboard");

    } catch (err) {
      console.log("Login error:", err);
      setError("Unable to log in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="border-4 border-black bg-[#00B7FF] p-6 sm:p-8 shadow-[8px_8px_0_black] sm:shadow-[10px_10px_0_black] order-2 md:order-1">

          <p className="font-black text-xs sm:text-sm tracking-[0.3em]">
            COSC PRESENTS
          </p>

          <h1 className="text-5xl sm:text-6xl font-extrabold mt-4">
            HACKWEEK
            <br />
            2026
          </h1>

          <p className="mt-6 text-base sm:text-lg font-bold">
            July 6 - July 12
          </p>

          <p className="mt-3 text-sm sm:text-base font-medium">
            One week of coding challenges,
            open source contributions,
            leaderboards and rewards.
          </p>

          <div className="mt-8 space-y-3 text-sm sm:text-base font-bold">
            <p>✓ Daily Challenges</p>
            <p>✓ Open Source Tracks</p>
            <p>✓ Public Profiles</p>
            <p>✓ Certificates & Rewards</p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0_black] sm:shadow-[10px_10px_0_black] flex flex-col justify-center order-1 md:order-2">

          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Login
          </h2>

          <p className="mt-3 text-sm sm:text-base font-medium">
            Sign in with GitHub to access
            your HackWeek dashboard.
          </p>

          {error ? (
            <p className="mt-4 border-4 border-black bg-[#FF595E] px-4 py-3 text-sm font-bold text-white shadow-[4px_4px_0_black]">
              {error}
            </p>
          ) : null}

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

          <p className="mt-4 text-xs sm:text-sm font-medium">
            Only pre-registered participants can log in.
          </p>

        </div>

      </div>
    </div>
  );
}