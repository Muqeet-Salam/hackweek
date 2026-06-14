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
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md border-4 border-black shadow-[10px_10px_0_black] p-8 bg-white space-y-5">

        <h1 className="text-3xl font-extrabold">
          Login to HackWeek
        </h1>

        <p className="font-medium">
          Continue with GitHub OAuth
        </p>

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Checking..." : "Continue with GitHub"}
        </Button>

        <p className="text-sm font-medium mt-4">
          New here? You must register before login.
        </p>

      </div>
    </div>
  );
}