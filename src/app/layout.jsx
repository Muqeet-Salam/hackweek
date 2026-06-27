import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E7] text-[#111111]">
      <ScrollToTop />
      <Navbar />

      <main className="relative flex-1 px-4 py-8 sm:px-6 sm:py-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}