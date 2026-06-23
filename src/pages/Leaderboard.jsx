import { useState, useEffect } from "react";
import { getLeaderboardData } from "../services/leaderboardService";
import { subscribeToSettings } from "../services/settingsService";
import { useAuthStore } from "../store/authstore";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScoresLive, setIsScoresLive] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLeaderboardData();
      setLeaderboard(data);
      setLoading(false);
    };
    
    fetchData();

    const unsubscribeSettings = subscribeToSettings((settings) => {
      setIsScoresLive(settings.scoresLive === true);
    });

    return () => unsubscribeSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <h2 className="text-3xl font-extrabold animate-pulse">Loading Leaderboard...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="border-4 border-black p-6 bg-[#FF8A00] shadow-[10px_10px_0_black]">
        <h1 className="text-5xl font-extrabold text-white" style={{textShadow: "4px 4px 0 black"}}>
          Leaderboard
        </h1>
        <p className="mt-4 text-xl font-bold border-2 border-black bg-white inline-block px-4 py-2 shadow-[4px_4px_0_black]">
          See how you stack up against the best builders!
        </p>
      </section>

      {!isScoresLive ? (
        <div className="border-4 border-black bg-[#FFD23F] p-12 text-center shadow-[10px_10px_0_black]">
          <h2 className="text-4xl font-extrabold mb-4">Scores are currently hidden</h2>
          <p className="text-2xl font-bold">The HackWeek team is still verifying submissions. Check back later!</p>
        </div>
      ) : (
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_black] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-[#FFD23F] border-b-4 border-black">
                <th className="p-4 font-extrabold text-xl border-r-4 border-black text-center w-24">Rank</th>
                <th className="p-4 font-extrabold text-xl border-r-4 border-black">Builder</th>
                <th className="p-4 font-extrabold text-xl border-r-4 border-black text-center">Projects</th>
                <th className="p-4 font-extrabold text-xl text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center font-bold text-xl">
                    No scores available yet.
                  </td>
                </tr>
              ) : (
                leaderboard.map((player, index) => {
                  const isMe = user && user.uid === player.uid;
                  return (
                    <tr 
                      key={player.uid} 
                      className={`border-b-4 border-black last:border-b-0 hover:bg-gray-50 transition-colors ${isMe ? 'bg-[#FFF8E7]' : ''}`}
                    >
                      <td className="p-4 font-extrabold text-2xl border-r-4 border-black text-center">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="p-4 border-r-4 border-black flex items-center gap-4">
                        {player.avatarUrl ? (
                          <img src={player.avatarUrl} alt="Avatar" className="w-10 h-10 border-2 border-black object-cover" />
                        ) : (
                          <div className="w-10 h-10 border-2 border-black bg-[#00B7FF] flex items-center justify-center font-bold text-sm">
                            {player.username.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-bold text-xl flex items-center gap-2">
                          {player.username}
                          {isMe && <span className="text-xs bg-[#7AE582] px-2 py-1 border-2 border-black ml-2 uppercase">You</span>}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-xl border-r-4 border-black text-center">
                        {player.verifiedSubmissions}
                      </td>
                      <td className="p-4 font-extrabold text-3xl text-center text-[#FF595E]">
                        {player.totalScore}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
