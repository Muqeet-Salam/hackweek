import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginAdmin } from "../services/adminAuthService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/challenges";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await loginAdmin(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFD23F] flex items-center justify-center p-4">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[12px_12px_0_black]">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Admin Portal</h1>
        
        {error && (
          <div className="mb-4 bg-[#FF595E] text-white border-2 border-black p-3 font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-bold mb-2">Username</label>
            <Input 
              required 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="admin" 
            />
          </div>
          
          <div>
            <label className="block font-bold mb-2">Password</label>
            <Input 
              required 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#00B7FF] text-xl mt-4">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
