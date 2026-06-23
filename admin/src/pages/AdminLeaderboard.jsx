import { useState, useEffect } from "react";
import { getRegistrations } from "../services/adminRegistrationService";
import { subscribeToSubmissions } from "../services/adminSubmissionService";
import { subscribeToSettings, updateSettings } from "../services/adminSettingsService";
import Badge from "../components/ui/Badge";

export default function AdminLeaderboard() {
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [settings, setSettings] = useState({ challengesLive: false, scoresLive: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getRegistrations();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users for leaderboard:", error);
      }
    };
    fetchUsers();

    const unsubSubmissions = subscribeToSubmissions((data) => {
      setSubmissions(data);
      setLoading(false);
    });

    const unsubSettings = subscribeToSettings((data) => {
      setSettings(data);
    });

    return () => {
      unsubSubmissions();
      unsubSettings();
    };
  }, []);

  const handleToggleScores = async () => {
    try {
      await updateSettings({ scoresLive: !settings.scoresLive });
    } catch (error) {
      console.error("Failed to toggle scores status:", error);
    }
  };

  const calculateLeaderboard = () => {
    const userScores = {};

    // Initialize all users with 0 score
    users.forEach((user) => {
      userScores[user.uid] = {
        uid: user.uid,
        fullName: user.fullName || "Unknown",
        email: user.email,
        githubProfile: user.githubProfile,
        totalScore: 0,
        verifiedSubmissions: 0,
      };
    });

    // Sum up verified scores
    submissions.forEach((sub) => {
      if (sub.status === "verified" && sub.score && userScores[sub.userId]) {
        userScores[sub.userId].totalScore += Number(sub.score);
        userScores[sub.userId].verifiedSubmissions += 1;
      }
    });

    return Object.values(userScores).sort((a, b) => b.totalScore - a.totalScore);
  };

  const leaderboard = calculateLeaderboard();

  if (loading) return <div className="text-2xl font-bold p-8">Loading leaderboard...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-4xl font-extrabold">Leaderboard Management</h2>
        
        <div className="flex items-center gap-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0_black]">
          <span className="font-bold text-lg">Scores Live Status:</span>
          <button
            onClick={handleToggleScores}
            className={`border-4 border-black px-6 py-2 font-bold shadow-[4px_4px_0_black] transition-transform hover:-translate-y-1 ${
              settings.scoresLive ? "bg-[#7AE582]" : "bg-[#FF595E] text-white"
            }`}
          >
            {settings.scoresLive ? "LIVE" : "HIDDEN"}
          </button>
        </div>
      </div>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0_black] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#FFD23F] border-b-4 border-black">
              <th className="p-4 font-extrabold text-lg border-r-4 border-black">Rank</th>
              <th className="p-4 font-extrabold text-lg border-r-4 border-black">Participant</th>
              <th className="p-4 font-extrabold text-lg border-r-4 border-black">Verified Submissions</th>
              <th className="p-4 font-extrabold text-lg">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 font-bold text-center text-xl">No participants found.</td>
              </tr>
            ) : (
              leaderboard.map((user, index) => (
                <tr key={user.uid} className="border-b-4 border-black last:border-b-0 hover:bg-gray-50">
                  <td className="p-4 font-bold text-xl border-r-4 border-black text-center">
                    {index + 1}
                  </td>
                  <td className="p-4 font-medium border-r-4 border-black">
                    <div className="font-bold text-lg">{user.fullName}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="p-4 font-bold border-r-4 border-black text-center">
                    {user.verifiedSubmissions}
                  </td>
                  <td className="p-4 font-extrabold text-2xl text-[#00B7FF]">
                    {user.totalScore}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
