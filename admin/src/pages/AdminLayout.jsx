import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login");
  };

  const navLinkClass = ({isActive}) => 
    `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#00B7FF]'}`;

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center border-b-4 border-black bg-[#FFD23F] p-4">
        <h1 className="text-2xl font-extrabold" style={{ textShadow: "1px 1px 0 white" }}>
          Admin Panel
        </h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="border-4 border-black bg-white p-2 shadow-[4px_4px_0_black]"
        >
          <span className="block w-6 h-1 bg-black mb-1"></span>
          <span className="block w-6 h-1 bg-black mb-1"></span>
          <span className="block w-6 h-1 bg-black"></span>
        </button>
      </div>

      <aside className={`${menuOpen ? "flex" : "hidden"} md:flex w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-black bg-[#FFD23F] p-6 flex-col`}>
        <h1 className="hidden md:block text-3xl font-extrabold mb-8" style={{ textShadow: "2px 2px 0 white" }}>
          Admin Panel
        </h1>
        <nav className="flex flex-col gap-4 flex-1">
          <NavLink 
            to="/challenges" 
            onClick={() => setMenuOpen(false)}
            className={({isActive}) => `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#00B7FF]'}`}
          >
            Manage Challenges
          </NavLink>
          <NavLink 
            to="/submissions" 
            onClick={() => setMenuOpen(false)}
            className={({isActive}) => `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#7AE582]'}`}
          >
            Review Submissions
          </NavLink>
          <NavLink 
            to="/registrations" 
            onClick={() => setMenuOpen(false)}
            className={({isActive}) => `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#FF5D8F] text-white'}`}
          >
            Registrations
          </NavLink>
          <NavLink 
            to="/leaderboard" 
            onClick={() => setMenuOpen(false)}
            className={({isActive}) => `border-4 border-black px-4 py-3 font-bold transition-transform hover:-translate-y-1 shadow-[4px_4px_0_black] ${isActive ? 'bg-white' : 'bg-[#FF8A00] text-white'}`}
          >
            Leaderboard
          </NavLink>
          <NavLink 
            to="/admins" 
            onClick={() => setMenuOpen(false)}
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
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
