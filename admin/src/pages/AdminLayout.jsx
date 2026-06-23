import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-black bg-[#FFD23F] p-6 flex flex-col">
        <h1 className="text-3xl font-extrabold mb-8" style={{ textShadow: "2px 2px 0 white" }}>
          Admin Panel
        </h1>
        <nav className="flex flex-col gap-4 flex-1">
          <NavLink 
            to="/challenges" 
            className={({isActive}) => `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#00B7FF]'}`}
          >
            Manage Challenges
          </NavLink>
          <NavLink 
            to="/submissions" 
            className={({isActive}) => `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#7AE582]'}`}
          >
            Review Submissions
          </NavLink>
          <NavLink 
            to="/registrations" 
            className={({isActive}) => `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#FF5D8F] text-white'}`}
          >
            Registrations
          </NavLink>
          <NavLink 
            to="/admins" 
            className={({isActive}) => `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#8338EC] text-white'}`}
          >
            Admin Access
          </NavLink>
        </nav>
        <button 
          onClick={handleLogout}
          className="mt-8 border-4 border-black bg-white px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black]"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
