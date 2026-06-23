import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Card from "../components/ui/Card";
import { useAuthStore } from "../store/authstore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState({
    projectsSubmitted: 0,
    pointsEarned: 0,
    rank: "--"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);

        // 0. Fetch Scores Go Live Status
        const settingsRef = doc(db, "settings", "general");
        const settingsSnap = await getDoc(settingsRef);
        const scoresLive = settingsSnap.exists() ? settingsSnap.data().scoresLive === true : false;

        // 1. Fetch user's submissions
        const subQuery = query(
          collection(db, "submissions"),
          where("userId", "==", user.uid)
        );
        const subSnap = await getDocs(subQuery);
        const submissions = subSnap.docs.map(doc => doc.data());
        const projectsCount = submissions.length;

        // Sum the scores from submissions
        const points = submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);

        // 2. Fetch leaderboard rank
        let userRank = "--";
        if (scoresLive) {
          const leaderboardRef = doc(db, "leaderboard", "hackweek-2026");
          const leaderboardSnap = await getDoc(leaderboardRef);
          
          if (leaderboardSnap.exists()) {
            const data = leaderboardSnap.data();
            const ranking = data.rankings?.find(r => r.userId === user.uid);
            if (ranking) {
              userRank = `#${ranking.rank}`;
            }
          }
        }

        setStats({
          projectsSubmitted: projectsCount,
          pointsEarned: scoresLive ? points : "--",
          rank: userRank
        });

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

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
          <h2 className="text-3xl font-extrabold">
            {loading ? "..." : stats.projectsSubmitted}
          </h2>
          <p className="font-bold">Projects Submitted</p>
        </Card>

        <Card>
          <h2 className="text-3xl font-extrabold">
            {loading ? "..." : stats.pointsEarned}
          </h2>
          <p className="font-bold">Points Earned</p>
        </Card>

        <Card>
          <h2 className="text-3xl font-extrabold">
            {loading ? "..." : stats.rank}
          </h2>
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

        <Link
          to="/challenges"
          className="border-4 border-black bg-[#FF5D8F] px-6 py-3 font-extrabold shadow-[6px_6px_0_black]"
        >
          View Challenges
        </Link>

        <Link
          to="/submissions"
          className="border-4 border-black bg-[#FFD23F] px-6 py-3 font-extrabold shadow-[6px_6px_0_black]"
        >
          View Submissions
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