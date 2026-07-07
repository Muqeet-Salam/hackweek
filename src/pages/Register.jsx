import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl border-4 border-black bg-white p-8 shadow-[10px_10px_0_black] space-y-6">
        <div className="border-4 border-black bg-[#FF595E] px-5 py-4 text-white shadow-[6px_6px_0_black]">
          <p className="text-xs font-black tracking-[0.3em] uppercase">Registration Closed</p>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">HackWeek 2026 signups are no longer open.</h1>
        </div>

        <p className="text-lg font-medium">
          New registrations have been closed. If you already have a HackWeek profile, use GitHub login to access your dashboard.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/login"
            className="border-4 border-black bg-[#00B7FF] px-6 py-3 text-center font-bold shadow-[6px_6px_0_black] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Go to Login
          </Link>

          <Link
            to="/"
            className="border-4 border-black bg-white px-6 py-3 text-center font-bold shadow-[6px_6px_0_black] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}