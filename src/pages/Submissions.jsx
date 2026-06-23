import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthStore } from "../store/authstore";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";

export default function Submissions() {
  const user = useAuthStore((state) => state.user);

  const [submissions, setSubmissions] = useState([]);
  const [challengesMap, setChallengesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // 1. Fetch user's submissions
        const subQuery = query(
          collection(db, "submissions"),
          where("userId", "==", user.uid)
        );
        const subSnap = await getDocs(subQuery);
        const subs = subSnap.docs.map((doc) => doc.data());

        // 2. Fetch all challenges to display metadata (e.g., title, points)
        const chalSnap = await getDocs(collection(db, "challenges"));
        const cmap = {};
        chalSnap.docs.forEach((doc) => {
          const data = doc.data();
          cmap[data.challengeId] = data;
        });

        // 3. Sort submissions by date (newest first)
        subs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        setSubmissions(subs);
        setChallengesMap(cmap);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "reviewed":
      case "approved":
        return { bg: "#7AE582", text: "Reviewed" };
      case "rejected":
        return { bg: "#FF595E", text: "Rejected" };
      case "pending":
      default:
        return { bg: "#FFD23F", text: "Pending Review" };
    }
  };

  if (loading) {
    return <div className="p-8 font-bold text-xl">Loading submissions...</div>;
  }

  return (
    <div className="space-y-8 py-4">
      {/* HEADER */}
      <div className="border-4 border-black bg-[#00B7FF] p-6 shadow-[8px_8px_0_black]">
        <h1 className="text-4xl font-extrabold text-white">Your Submissions</h1>
        <p className="mt-2 font-medium text-white/95">
          Track the evaluation status, scores, and feedback for all your challenge solutions.
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <div className="text-center py-10 space-y-4">
            <h2 className="text-2xl font-black">No submissions yet!</h2>
            <p className="font-medium text-gray-600 max-w-md mx-auto">
              You haven't submitted any solutions yet. Explore our open tracks and submit your work!
            </p>
            <div className="pt-2">
              <Link
                to="/challenges"
                className="inline-block border-4 border-black bg-[#FFD23F] px-6 py-3 font-extrabold shadow-[6px_6px_0_black] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Go to Challenges
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((sub) => {
            const chal = challengesMap[sub.challengeId] || {};
            const statusConfig = getStatusStyle(sub.status);

            return (
              <div
                key={sub.submissionId}
                className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Row - Status & Challenge Category */}
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase font-extrabold tracking-wider bg-black text-white px-2 py-1">
                      {chal.category || "General"}
                    </span>
                    <span
                      className="border-2 border-black px-2.5 py-0.5 text-xs font-bold text-black"
                      style={{ backgroundColor: statusConfig.bg }}
                    >
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Title & Date */}
                  <div>
                    <h3 className="text-2xl font-black leading-tight">
                      {chal.title || `Challenge (${sub.challengeId})`}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 mt-1">
                      Submitted on: {formatDate(sub.submittedAt)}
                    </p>
                  </div>

                  {/* Tech Tags */}
                  {sub.technologiesUsed && sub.technologiesUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sub.technologiesUsed.map((tech) => (
                        <span
                          key={tech}
                          className="border-2 border-black bg-[#FFF8E7] px-2 py-0.5 text-xs font-bold text-black"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {sub.description && (
                    <p className="text-sm font-medium text-gray-600 leading-relaxed border-t-2 border-dashed border-gray-300 pt-3">
                      {sub.description}
                    </p>
                  )}

                  {/* Repository Links */}
                  <div className="flex gap-3 flex-wrap pt-2">
                    <a
                      href={sub.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-black bg-[#FF5D8F] px-3.5 py-1.5 text-xs font-extrabold text-black shadow-[3px_3px_0_black] hover:bg-opacity-90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      GitHub Repo ↗
                    </a>
                    {sub.projectUrl && (
                      <a
                        href={sub.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-black bg-white px-3.5 py-1.5 text-xs font-extrabold text-black shadow-[3px_3px_0_black] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Score & Feedback Section */}
                {(sub.score > 0 || sub.feedback || sub.status?.toLowerCase() === "reviewed") && (
                  <div className="mt-6 border-4 border-black bg-[#FFF8E7] p-4 shadow-[4px_4px_0_black] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm uppercase">Evaluation Score</span>
                      <span className="font-black text-lg border-2 border-black bg-white px-2 py-0.5">
                        {sub.score} / {chal.points || 100}
                      </span>
                    </div>
                    {sub.feedback && (
                      <div className="text-xs font-medium text-gray-700 leading-relaxed">
                        <span className="font-bold block text-black mb-0.5">Reviewer Feedback:</span>
                        "{sub.feedback}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
