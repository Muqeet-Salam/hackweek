import { useState, useEffect } from "react";
import { collection, doc, getDocs, setDoc, query, where, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthStore } from "../store/authstore";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

const SAMPLE_CHALLENGES = [
  {
    challengeId: "neo-brutalist-components",
    eventId: "hackweek-2026",
    title: "Custom Neo-Brutalist Component Library",
    slug: "neo-brutalist-components",
    description: "Build a highly polished, fully accessible Neo-Brutalist react component library featuring buttons, cards, modals, and inputs.",
    category: "Frontend",
    difficulty: "Easy",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    points: 100,
    requirements: [
      "Create accessible components conforming to WAI-ARIA guidelines.",
      "Include standard components: Button, Card, Modal, and Input.",
      "Design using Neo-Brutalist guidelines: thick black borders, flat colors, offset shadows."
    ],
    resources: [
      "https://brutalistwebsites.com",
      "https://tailwindcss.com"
    ],
    startDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participantsCount: 0,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    challengeId: "realtime-board",
    eventId: "hackweek-2026",
    title: "Realtime Collaboration Board",
    slug: "realtime-board",
    description: "Develop a collaborative dashboard where multiple developers can share, code, and chat in real-time using WebSockets or Firestore.",
    category: "Fullstack",
    difficulty: "Medium",
    technologies: ["React", "Firebase", "WebSockets"],
    points: 250,
    requirements: [
      "Realtime canvas drawing or block creation.",
      "Multiplayer support with active user indicators (avatars, active cursors).",
      "Chat widget integration for real-time discussion."
    ],
    resources: [
      "https://firebase.google.com/docs/firestore"
    ],
    startDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participantsCount: 0,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    challengeId: "decentralized-tracker",
    eventId: "hackweek-2026",
    title: "Decentralized Open Source Tracker",
    slug: "decentralized-tracker",
    description: "Build a dashboard to monitor and verify open-source contributions automatically from GitHub webhook events and allocate reward tokens.",
    category: "Web3/Backend",
    difficulty: "Hard",
    technologies: ["Node.js", "GitHub API", "Solidity"],
    points: 500,
    requirements: [
      "Integrate GitHub webhooks for pull request monitoring.",
      "Implement automatic contribution validation rules.",
      "Simulate smart contract token allocation based on contribution values."
    ],
    resources: [
      "https://docs.github.com/en/webhooks"
    ],
    startDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participantsCount: 0,
    status: "active",
    createdAt: new Date().toISOString()
  }
];

export default function Challenges() {
  const user = useAuthStore((state) => state.user);

  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [submittedChallengeIds, setSubmittedChallengeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Form state
  const [githubRepo, setGithubRepo] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [description, setDescription] = useState("");
  const [technologiesUsed, setTechnologiesUsed] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // 1. Fetch Challenges
        const challengesRef = collection(db, "challenges");
        let snap = await getDocs(challengesRef);

        let list = snap.docs.map(d => d.data());

        // Auto-seed if empty
        if (list.length === 0) {
          const batch = writeBatch(db);
          SAMPLE_CHALLENGES.forEach(c => {
            const docRef = doc(db, "challenges", c.challengeId);
            batch.set(docRef, c);
          });
          await batch.commit();

          snap = await getDocs(challengesRef);
          list = snap.docs.map(d => d.data());
        }

        setChallenges(list);
        if (list.length > 0) {
          setSelectedChallenge(list[0]);
        }

        // 2. Fetch User Submissions to track completed challenges
        const subQuery = query(collection(db, "submissions"), where("userId", "==", user.uid));
        const subSnap = await getDocs(subQuery);
        const completedIds = new Set(subSnap.docs.map(d => d.data().challengeId));
        setSubmittedChallengeIds(completedIds);

      } catch (err) {
        console.error("Error loading challenges:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!githubRepo.trim() || submitting) return;

    if (!githubRepo.trim().toLowerCase().includes("github.com/")) {
      setError("Please enter a valid GitHub repository URL (must contain github.com/).");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess(false);

      const submissionId = `sub-${selectedChallenge.challengeId}-${user.uid}`;
      const subRef = doc(db, "submissions", submissionId);

      const techArray = technologiesUsed
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await setDoc(subRef, {
        submissionId,
        eventId: selectedChallenge.eventId || "hackweek-2026",
        challengeId: selectedChallenge.challengeId,
        userId: user.uid,
        githubRepo: githubRepo.trim(),
        projectUrl: projectUrl.trim(),
        description: description.trim(),
        technologiesUsed: techArray,
        attachments: [],
        status: "pending",
        score: 0,
        feedback: "",
        submittedAt: new Date().toISOString(),
        reviewedAt: null
      });

      setSuccess(true);
      setSubmittedChallengeIds(prev => new Set([...prev, selectedChallenge.challengeId]));

      // Clear Form
      setGithubRepo("");
      setProjectUrl("");
      setDescription("");
      setTechnologiesUsed("");

    } catch (err) {
      console.error("Submission failed:", err);
      setError("Failed to submit. Please check your network and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "#7AE582";
      case "medium":
        return "#FFD23F";
      case "hard":
        return "#FF595E";
      default:
        return "#00B7FF";
    }
  };

  if (loading) {
    return <div className="p-8 font-bold text-xl">Loading challenges...</div>;
  }

  return (
    <div className="space-y-8 py-4">
      {/* HEADER */}
      <div className="border-4 border-black bg-[#FFD23F] p-6 shadow-[8px_8px_0_black]">
        <h1 className="text-4xl font-extrabold">HackWeek Challenges</h1>
        <p className="mt-2 font-medium">
          Click on a challenge below to view details and submit your solution.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black mb-2">Available Tracks</h2>
        {challenges.map((c) => {
          const isExpanded = selectedChallenge?.challengeId === c.challengeId;
          const isSubmitted = submittedChallengeIds.has(c.challengeId);

          return (
            <div
              key={c.challengeId}
              className="border-4 border-black bg-white shadow-[8px_8px_0_black] overflow-hidden"
            >
              {/* CARD HEADER / TOGGLE TAB */}
              <div
                onClick={() => {
                  if (isExpanded) {
                    setSelectedChallenge(null);
                  } else {
                    setSelectedChallenge(c);
                    setError("");
                    setSuccess(false);
                  }
                }}
                className={`cursor-pointer p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-black transition-colors text-left ${
                  isExpanded ? "bg-[#00B7FF] text-white" : "bg-[#FFF8E7] text-black hover:bg-white"
                }`}
              >
                <div className="space-y-2 text-left w-full md:w-auto">
                  <div className="flex items-center justify-start gap-2 flex-wrap text-left">
                    <span
                      className="border-2 border-black px-2.5 py-0.5 text-xs font-bold text-black"
                      style={{ backgroundColor: getDifficultyColor(c.difficulty) }}
                    >
                      {c.difficulty}
                    </span>
                    <span className={`text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 border-2 border-black ${
                      isExpanded ? "bg-white text-black" : "bg-black text-white"
                    }`}>
                      {c.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-left">{c.title}</h3>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto text-left">
                  <span className="font-extrabold text-sm border-2 border-black px-3 py-1 bg-white text-black shadow-[2px_2px_0_black]">
                    {c.points} PTS
                  </span>
                  <span className="text-2xl font-black">
                    {isExpanded ? "−" : "+"}
                  </span>
                </div>
              </div>

              {/* EXPANDED CONTENT */}
              {isExpanded && (
                <div className="p-6 md:p-8 space-y-6 bg-white text-black">
                  {/* Description */}
                  <div>
                    <p className="font-medium text-gray-700 leading-relaxed text-lg">
                      {c.description}
                    </p>
                  </div>

                  {/* Requirements */}
                  <div className="border-t-2 border-dashed border-gray-300 pt-4">
                    <h4 className="text-xl font-black mb-3">Requirements</h4>
                    <ul className="list-none space-y-2 font-medium text-gray-800">
                      {c.requirements?.map((req, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  {c.resources && c.resources.length > 0 && (
                    <div className="border-t-2 border-dashed border-gray-300 pt-4">
                      <h4 className="text-xl font-black mb-3">Resources</h4>
                      <div className="flex flex-wrap gap-2">
                        {c.resources.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-black bg-[#FFF8E7] px-3 py-1.5 text-sm font-bold shadow-[2px_2px_0_black] hover:bg-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                          >
                            Resource {idx + 1} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submission Status or Form */}
                  <div className="border-t-4 border-black pt-6">
                    {isSubmitted ? (
                      <div className="border-4 border-black bg-[#7AE582] p-5 shadow-[4px_4px_0_black] text-center">
                        <h4 className="text-xl font-black">Solution Submitted!</h4>
                        <p className="mt-1 font-medium text-sm">
                          You have successfully submitted your solution. Check its status on the{" "}
                          <Link to="/submissions" className="underline font-bold text-black">
                            Submissions
                          </Link>{" "}
                          dashboard.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmission} className="space-y-4">
                        <h4 className="text-2xl font-black">Submit Solution</h4>

                        {error && (
                          <div className="border-2 border-black bg-[#FF595E] p-3 text-sm font-bold text-black">
                            {error}
                          </div>
                        )}

                        {success && (
                          <div className="border-2 border-black bg-[#7AE582] p-3 text-sm font-bold text-black">
                            Submission created successfully!
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-bold mb-1.5 text-sm">GitHub Repository URL *</label>
                            <input
                              type="url"
                              required
                              value={githubRepo}
                              onChange={(e) => setGithubRepo(e.target.value)}
                              placeholder="https://github.com/username/repo"
                              className="w-full border-4 border-black bg-[#FFF8E7] px-4 py-2.5 font-medium outline-none focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block font-bold mb-1.5 text-sm">Live Demo URL (Optional)</label>
                            <input
                              type="url"
                              value={projectUrl}
                              onChange={(e) => setProjectUrl(e.target.value)}
                              placeholder="https://demo.example.com"
                              className="w-full border-4 border-black bg-[#FFF8E7] px-4 py-2.5 font-medium outline-none focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold mb-1.5 text-sm">Description of Your Implementation</label>
                          <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe what you built, any architectural patterns used, or instructions to run it..."
                            className="w-full border-4 border-black bg-[#FFF8E7] px-4 py-2.5 font-medium outline-none focus:bg-white resize-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1.5 text-sm">Technologies Used (Comma separated)</label>
                          <input
                            type="text"
                            value={technologiesUsed}
                            onChange={(e) => setTechnologiesUsed(e.target.value)}
                            placeholder="React, Tailwind, WebSockets"
                            className="w-full border-4 border-black bg-[#FFF8E7] px-4 py-2.5 font-medium outline-none focus:bg-white"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={submitting}
                          className="w-full mt-2"
                        >
                          {submitting ? "Submitting..." : "Submit Project Solution"}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
