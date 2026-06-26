import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthStore } from "../store/authstore";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const user = useAuthStore((state) => state.user);
  const [rankings, setRankings] = useState([]);
  const [publishedAt, setPublishedAt] = useState(null);
  const [isScoresLive, setIsScoresLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // 1. Fetch settings to see if scores are live
        const settingsRef = doc(db, "settings", "general");
        const settingsSnap = await getDoc(settingsRef);
        const scoresLive = settingsSnap.exists() ? settingsSnap.data().scoresLive === true : false;
        setIsScoresLive(scoresLive);

        if (scoresLive) {
          // 2. Fetch published rankings
          const leaderboardRef = doc(db, "leaderboard", "hackweek-2026");
          const leaderboardSnap = await getDoc(leaderboardRef);
          if (leaderboardSnap.exists()) {
            const data = leaderboardSnap.data();
            setRankings(data.rankings || []);
            setPublishedAt(data.lastUpdated || data.publishedAt || null);
          }
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-[#FFD23F]"; // Gold
      case 2:
        return "bg-[#00B7FF] text-white"; // Silver / Blue
      case 3:
        return "bg-[#FF5D8F]"; // Bronze / Pink
      default:
        return "bg-white text-black";
    }
  };

  if (loading) {
    return <div className="p-8 font-bold text-xl">Loading leaderboard...</div>;
  }

  if (!isScoresLive) {
    return (
      <div className="max-w-2xl mx-auto my-12 text-center space-y-8">
        <div className="border-4 border-black bg-[#FF595E] p-8 shadow-[12px_12px_0_black]">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">Leaderboard Offline</h1>
          <p className="font-bold text-lg text-black leading-relaxed">
            The HackWeek standings are currently offline. We will publish the rankings soon.
          </p>
        </div>
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] inline-block">
          <Link
            to="/dashboard"
            className="border-4 border-black bg-[#00B7FF] px-6 py-3 font-extrabold shadow-[4px_4px_0_black] text-black hover:bg-white transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none inline-block"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* HEADER */}
      <div className="border-4 border-black bg-[#8338EC] p-6 shadow-[8px_8px_0_black] text-white">
        <h1 className="text-4xl font-extrabold">Builder Standings</h1>
        <p className="mt-2 font-medium text-white/95">
          Live leaderboard tracking submissions and total scores for HackWeek 2026.
        </p>
        {publishedAt && (
          <p className="text-xs font-semibold mt-2 text-white/80">
            Last Updated: <strong>{formatDate(publishedAt)}</strong>
          </p>
        )}
      </div>

      {rankings.length === 0 ? (
        <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_black] text-center space-y-4 my-8">
          <h3 className="text-3xl font-black">No Standings Published Yet</h3>
          <p className="font-bold text-gray-700 max-w-md mx-auto">
            Organizers are still reviewing solutions. Check back shortly to see the final ranks!
          </p>
        </div>
      ) : (
        <div className="border-4 border-black bg-white shadow-[8px_8px_0_black] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-black bg-[#FFF8E7] text-black text-sm sm:text-base">
                <th className="py-3 sm:py-4 px-3 sm:px-6 font-black border-r-2 border-black w-16 sm:w-24 text-center">Rank</th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 font-black border-r-2 border-black">Builder</th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 font-black border-r-2 border-black hidden sm:table-cell">Affiliation</th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 font-black text-right w-24 sm:w-36">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const paginatedRankings = rankings.slice(startIndex, startIndex + itemsPerPage);
                return paginatedRankings.map((item) => {
                const isCurrentUser = user && item.userId === user.uid;

                return (
                  <tr
                    key={item.userId}
                    className={`border-b-4 border-black transition-colors ${
                      isCurrentUser ? "bg-yellow-50 hover:bg-yellow-100" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-black border-r-2 border-black align-middle text-center w-16 sm:w-24">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border-2 border-black font-black text-sm sm:text-base ${getRankBadgeColor(
                          item.rank
                        )} shadow-[2px_2px_0_black]`}
                      >
                        {item.rank}
                      </span>
                    </td>

                    {/* Builder Name */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 border-r-2 border-black align-middle font-bold text-sm sm:text-lg text-black">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate max-w-[120px] sm:max-w-none">{item.fullName}</span>
                        {isCurrentUser && (
                          <span className="border-2 border-black bg-[#7AE582] text-[#111111] text-[8px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.5 uppercase tracking-wide shadow-[1px_1px_0_black]">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Affiliation */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 border-r-2 border-black align-middle font-semibold text-gray-700 hidden sm:table-cell text-sm">
                      {item.collegeName || "Individual"}
                    </td>

                    {/* Total Points */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-right font-black text-base sm:text-2xl text-[#FF5D8F] align-middle w-24 sm:w-36">
                      {item.points !== undefined ? item.points : (item.totalPoints !== undefined ? item.totalPoints : 0)}{" "}
                      <span className="text-[10px] sm:text-xs text-black font-extrabold">PTS</span>
                    </td>
                  </tr>
                );
              })})()}
            </tbody>
          </table>
          {(() => {
            const totalPages = Math.ceil(rankings.length / itemsPerPage);
            return totalPages > 1 && (
              <div className="flex justify-between items-center bg-[#FFF8E7] border-t-4 border-black p-4 font-bold select-none">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 border-4 border-black bg-[#00B7FF] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition shadow-[2px_2px_0_black] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-sm sm:text-base">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 border-4 border-black bg-[#00B7FF] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition shadow-[2px_2px_0_black] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                >
                  Next
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
