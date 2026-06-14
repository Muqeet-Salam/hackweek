import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { useAuthStore } from "../store/authstore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const formatDate = (value) => {
  if (!value) return "Unknown";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRelativeDays = (value) => {
  if (!value) return "Unknown";

  const date = new Date(value);
  const days = Math.max(
    1,
    Math.floor((Date.now() - date.getTime()) / MS_PER_DAY)
  );

  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="space-y-8">

      {/* WELCOME */}
      <section className="border-4 border-black p-6 bg-white shadow-[10px_10px_0_black]">
        <h1 className="text-4xl font-extrabold">
          Welcome back, {user.displayName || "Builder"}
        </h1>

        <p className="mt-2 font-medium">
          HackWeek 2026 Dashboard
        </p>
      </section>

      {/* QUICK STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <h2 className="text-3xl font-extrabold">0</h2>
          <p className="font-bold">Projects Submitted</p>
        </Card>

        <Card>
          <h2 className="text-3xl font-extrabold">0</h2>
          <p className="font-bold">Points Earned</p>
        </Card>

        <Card>
          <h2 className="text-3xl font-extrabold">#--</h2>
          <p className="font-bold">Leaderboard Rank</p>
        </Card>

      </section>

      {/* ACTIONS */}
      <section className="flex gap-4 flex-wrap">

        <Link
          to="/profile"
          className="border-4 border-black bg-[#00B7FF] px-6 py-3 font-extrabold shadow-[6px_6px_0_black]"
        >
          View Profile
        </Link>

      </section>
      {/* EVENT STATUS */}
      <section className="border-4 border-black bg-white p-6 shadow-[10px_10px_0_black]">

        <h2 className="text-3xl font-extrabold">
          HackWeek Status
        </h2>

        <p className="mt-2 font-medium">
          Challenges go live on <span className="font-extrabold">July 6th, 2026</span>.
        </p>

        <div className="mt-4 border-4 border-black bg-[#FFF8E7] p-4">
          <p className="font-bold">
            Until then:
          </p>

          <ul className="mt-2 font-medium space-y-1">
            <li>• Complete your profile</li>
            <li>• Explore upcoming challenges</li>
            <li>• Join community discussions</li>
          </ul>
        </div>

      </section>
    </div>
  );
}