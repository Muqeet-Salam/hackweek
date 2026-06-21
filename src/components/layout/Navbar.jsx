import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { logoutUser } from "../../firebase/auth";
import { useAuthStore } from "../../store/authstore";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const username =
    profile?.username ?? user?.displayName ?? user?.email?.split("@")[0] ?? "Builder";
  const avatarUrl = profile?.avatarUrl ?? user?.photoURL ?? "";

  return (
    <header className="sticky top-0 z-30 border-b-4 border-black bg-[#FFF8E7] shadow-[0_6px_0_black]">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-extrabold tracking-tight uppercase"
        >
          <img
            src={logo}
            alt="HackWeek Logo"
            className="h-10 w-10 object-contain"
          />
          <span>
            HackWeek<span className="text-[#00B7FF]">2026</span>
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden border-4 border-black bg-white p-3 shadow-[4px_4px_0_black]"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-6 bg-black mb-1" />
          <span className="block h-0.5 w-6 bg-black mb-1" />
          <span className="block h-0.5 w-6 bg-black" />
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-3 font-bold text-sm">
          <Link className="border-4 border-black bg-white px-3 py-2 shadow-[4px_4px_0_black] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" to="/">
            Home
          </Link>

          {!user ? (
            <Link className="border-4 border-black bg-[#00B7FF] px-3 py-2 shadow-[4px_4px_0_black] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" to="/login">
              Login
            </Link>
          ) : null}

          {!user ? (
            <Link className="border-4 border-black bg-[#00B7FF] px-3 py-2 shadow-[4px_4px_0_black] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" to="/register">
              Register
            </Link>
          ) : null}

          {user ? (
            <>
              <Link className="border-4 border-black bg-[#7AE582] px-3 py-2 shadow-[4px_4px_0_black] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" to="/dashboard">
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 border-4 border-black bg-white px-3 py-2 shadow-[4px_4px_0_black] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${username} avatar`}
                    className="h-8 w-8 border-2 border-black object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-[#00B7FF] text-[10px] font-extrabold text-black">
                    {username.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <span className="font-bold text-sm">
                  {username}
                </span>
              </Link>

              <Button type="button" onClick={handleLogout} className="bg-[#FF595E] text-white">
                Logout
              </Button>
            </>
          ) : null}
        </nav>
      </div>
      {menuOpen ? (
        <div className="md:hidden border-t-4 border-black bg-[#FFF8E7] px-4 pb-4 pt-4">
          <nav className="flex flex-col gap-3 font-bold text-sm">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="border-4 border-black bg-white px-4 py-3 shadow-[4px_4px_0_black]"
            >
              Home
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="border-4 border-black bg-[#00B7FF] px-4 py-3 shadow-[4px_4px_0_black]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="border-4 border-black bg-[#00B7FF] px-4 py-3 shadow-[4px_4px_0_black]"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="border-4 border-black bg-[#7AE582] px-4 py-3 shadow-[4px_4px_0_black]"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="border-4 border-black bg-white px-4 py-3 shadow-[4px_4px_0_black]"
                >
                  Profile
                </Link>
                <Button
                  type="button"
                  onClick={async () => {
                    await handleLogout();
                    setMenuOpen(false);
                  }}
                  className="bg-[#FF595E] text-white w-full"
                >
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}