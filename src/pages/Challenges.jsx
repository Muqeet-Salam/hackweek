import { useState, useEffect } from "react";
import { collection, doc, getDocs, getDoc, setDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthStore } from "../store/authstore";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";



export default function Challenges() {
  const user = useAuthStore((state) => state.user);

  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [submittedChallengeIds, setSubmittedChallengeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [activeView, setActiveView] = useState("list"); // "list" or "details"
  const [activeTab, setActiveTab] = useState("description"); // "description" or "submission"

  // Form state
  const [githubRepo, setGithubRepo] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [description, setDescription] = useState("");
  const [technologiesUsed, setTechnologiesUsed] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState({});
  const [forceShowForm, setForceShowForm] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // 1. Fetch Challenges Go Live Status
        const settingsRef = doc(db, "settings", "general");
        const settingsSnap = await getDoc(settingsRef);
        const live = settingsSnap.exists() ? settingsSnap.data().challengesLive === true : false;
        setIsLive(live);

        // 2. Fetch User Submissions to track completed challenges and pre-populate submissions
        const subQuery = query(collection(db, "submissions"), where("userId", "==", user.uid));
        const subSnap = await getDocs(subQuery);
        const completedIds = new Set();
        const submissionsMap = {};
        subSnap.docs.forEach((doc) => {
          const data = doc.data();
          completedIds.add(data.challengeId);
          submissionsMap[data.challengeId] = data;
        });
        setSubmittedChallengeIds(completedIds);
        setUserSubmissions(submissionsMap);

        // 3. Fetch Challenges
        const challengesRef = collection(db, "challenges");
        const snap = await getDocs(challengesRef);
        const list = snap.docs.map(d => d.data());

        setChallenges(list);
        if (list.length > 0) {
          const firstChallenge = list[0];
          setSelectedChallenge(firstChallenge);
          
          const existingSub = submissionsMap[firstChallenge.challengeId];
          if (existingSub) {
            setGithubRepo(existingSub.githubRepo || "");
            setProjectUrl(existingSub.projectUrl || "");
            setDescription(existingSub.description || "");
            setTechnologiesUsed(
              Array.isArray(existingSub.technologiesUsed)
                ? existingSub.technologiesUsed.join(", ")
                : existingSub.technologiesUsed || ""
            );
          }
        }

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

      const submissionData = {
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
      };

      await setDoc(subRef, submissionData);

      setSuccess(true);
      setSubmittedChallengeIds(prev => new Set([...prev, selectedChallenge.challengeId]));
      setUserSubmissions(prev => ({
        ...prev,
        [selectedChallenge.challengeId]: submissionData
      }));
      setForceShowForm(false);

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
      case "beginner":
        return "#7AE582";
      case "medium":
      case "intermediate":
        return "#FFD23F";
      case "hard":
      case "advanced":
        return "#FF595E";
      default:
        return "#00B7FF";
    }
  };

  if (loading) {
    return <div className="p-8 font-bold text-xl">Loading challenges...</div>;
  }

  if (!isLive) {
    return (
      <div className="max-w-2xl mx-auto my-12 text-center space-y-8">
        <div className="border-4 border-black bg-[#FF595E] p-8 shadow-[12px_12px_0_black]">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">Challenges Offline</h1>
          <p className="font-bold text-lg text-black leading-relaxed">
            The HackWeek challenges are currently offline. We will turn them online soon.
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

  // Safe parsing helper for selected challenge details
  const resourcesList = selectedChallenge
    ? (Array.isArray(selectedChallenge.resources)
        ? selectedChallenge.resources
        : (typeof selectedChallenge.resources === "string" && selectedChallenge.resources.trim() ? [selectedChallenge.resources] : []))
    : [];

  const requirementsList = selectedChallenge
    ? (Array.isArray(selectedChallenge.requirements)
        ? selectedChallenge.requirements
        : (typeof selectedChallenge.requirements === "string" && selectedChallenge.requirements.trim() ? [selectedChallenge.requirements] : []))
    : [];

  const techList = selectedChallenge
    ? (Array.isArray(selectedChallenge.technologies)
        ? selectedChallenge.technologies
        : (typeof selectedChallenge.technologies === "string" && selectedChallenge.technologies.trim() ? selectedChallenge.technologies.split(",").map(t => t.trim()) : []))
    : [];

  const formatDifficulty = (diff) => {
    if (!diff) return "";
    const lower = diff.toLowerCase();
    if (lower === "easy" || lower === "beginner") return "Beginner";
    if (lower === "medium" || lower === "intermediate") return "Intermediate";
    if (lower === "hard" || lower === "advanced") return "Advanced";
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  const filteredChallenges = challenges.filter(c => {
    if (selectedDifficulty === "All") return true;
    const challengeDiff = c.difficulty?.toLowerCase();
    const filterDiff = selectedDifficulty.toLowerCase();
    
    if (filterDiff === "beginner") {
      return challengeDiff === "beginner" || challengeDiff === "easy";
    }
    if (filterDiff === "intermediate") {
      return challengeDiff === "intermediate" || challengeDiff === "medium";
    }
    if (filterDiff === "advanced") {
      return challengeDiff === "advanced" || challengeDiff === "hard";
    }
    return challengeDiff === filterDiff;
  });

  const isSelectedSubmitted = selectedChallenge ? submittedChallengeIds.has(selectedChallenge.challengeId) : false;

  return (
    <div className="space-y-8 py-4">
      {activeView === "list" ? (
        <>
          {/* HEADER */}
          <div className="border-4 border-black bg-[#FFD23F] p-6 shadow-[8px_8px_0_black]">
            <h1 className="text-4xl font-extrabold">HackWeek Challenges</h1>
            <p className="mt-2 font-medium">
              Select a challenge below to view its description, requirements, resources, and submit your project solution.
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-3 border-4 border-black bg-white p-5 shadow-[6px_6px_0_black]">
            <span className="font-extrabold text-sm sm:text-base mr-2 uppercase tracking-wider">Difficulty:</span>
            <button
              onClick={() => setSelectedDifficulty("All")}
              className={`px-4 py-2 font-extrabold border-3 border-black shadow-[3px_3px_0_black] transition-transform hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-sm cursor-pointer ${
                selectedDifficulty === "All" ? "bg-[#FFD23F] text-black" : "bg-[#FFF8E7] text-black hover:bg-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDifficulty("Beginner")}
              className={`px-4 py-2 font-extrabold border-3 border-black shadow-[3px_3px_0_black] transition-transform hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-sm cursor-pointer ${
                selectedDifficulty === "Beginner" ? "bg-[#7AE582] text-black" : "bg-[#FFF8E7] text-black hover:bg-white"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setSelectedDifficulty("Intermediate")}
              className={`px-4 py-2 font-extrabold border-3 border-black shadow-[3px_3px_0_black] transition-transform hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-sm cursor-pointer ${
                selectedDifficulty === "Intermediate" ? "bg-[#FFD23F] text-black" : "bg-[#FFF8E7] text-black hover:bg-white"
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setSelectedDifficulty("Advanced")}
              className={`px-4 py-2 font-extrabold border-3 border-black shadow-[3px_3px_0_black] transition-transform hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-sm cursor-pointer ${
                selectedDifficulty === "Advanced" ? "bg-[#FF595E] text-black" : "bg-[#FFF8E7] text-black hover:bg-white"
              }`}
            >
              Advanced
            </button>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black">Available Tracks</h2>
            {challenges.length === 0 ? (
              <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_black] text-center space-y-4 my-8">
                <h3 className="text-3xl font-black">No Challenges Available</h3>
                <p className="font-bold text-gray-700 max-w-md mx-auto">
                   Challenges will be posted soon. Check back later for exciting tracks to build!
                </p>
              </div>
            ) : filteredChallenges.length === 0 ? (
              <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_black] text-center space-y-4 my-8">
                <h3 className="text-3xl font-black">No Matches Found</h3>
                <p className="font-bold text-gray-700 max-w-md mx-auto">
                   No challenges match your selected filters. Try choosing different options or clearing the filters!
                </p>
                <button
                  onClick={() => {
                    setSelectedDifficulty("All");
                  }}
                  className="border-4 border-black bg-[#00B7FF] text-white font-extrabold px-6 py-2.5 shadow-[4px_4px_0_black] hover:bg-opacity-95 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredChallenges.map((c) => {
                  const isSubmitted = submittedChallengeIds.has(c.challengeId);

                  return (
                    <div
                      key={c.challengeId}
                      onClick={() => {
                        setSelectedChallenge(c);
                        setActiveView("details");
                        setActiveTab("description");
                        setError("");
                        setSuccess(false);
                        setForceShowForm(false);
                        
                        const existingSub = userSubmissions[c.challengeId];
                        if (existingSub) {
                          setGithubRepo(existingSub.githubRepo || "");
                          setProjectUrl(existingSub.projectUrl || "");
                          setDescription(existingSub.description || "");
                          setTechnologiesUsed(
                            Array.isArray(existingSub.technologiesUsed)
                              ? existingSub.technologiesUsed.join(", ")
                              : existingSub.technologiesUsed || ""
                          );
                        } else {
                          setGithubRepo("");
                          setProjectUrl("");
                          setDescription("");
                          setTechnologiesUsed("");
                        }
                      }}
                      className="cursor-pointer border-4 border-black bg-white shadow-[8px_8px_0_black] overflow-hidden transition-transform hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex flex-col justify-between h-full"
                    >
                      {/* CARD HEADER */}
                      <div className="p-4 bg-[#FFF8E7] border-b-4 border-black flex justify-between items-center gap-2">
                        <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 border-2 border-black bg-black text-white truncate max-w-[150px]">
                          {c.category}
                        </span>
                        <span className="font-extrabold text-sm border-2 border-black px-2.5 py-0.5 bg-white text-black shadow-[2px_2px_0_black] whitespace-nowrap">
                          {c.points} PTS
                        </span>
                      </div>

                      {/* CARD BODY */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-left leading-tight line-clamp-2">
                            {c.title}
                          </h3>
                          {c.description && (
                            <p className="text-sm font-medium text-gray-600 line-clamp-3 text-left leading-relaxed">
                              {c.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* CARD FOOTER */}
                      <div className="p-4 border-t-4 border-black flex justify-between items-center bg-gray-50">
                        <span
                          className="border-2 border-black px-2.5 py-0.5 text-xs font-bold text-black"
                          style={{ backgroundColor: getDifficultyColor(c.difficulty) }}
                        >
                          {formatDifficulty(c.difficulty)}
                        </span>
                        {isSubmitted ? (
                          <span className="border-2 border-black bg-[#7AE582] text-black text-xs font-extrabold px-3 py-1.5 shadow-[2px_2px_0_black]">
                            ✓ SUBMITTED
                          </span>
                        ) : (
                          <span className="border-2 border-black bg-[#00B7FF] text-white text-xs font-extrabold px-3 py-1.5 shadow-[2px_2px_0_black]">
                            OPEN →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        selectedChallenge && (
          <div className="space-y-6 text-left">
            {/* BACK BUTTON */}
            <div>
              <button
                onClick={() => setActiveView("list")}
                className="border-4 border-black bg-[#FFF8E7] px-6 py-2.5 font-extrabold shadow-[4px_4px_0_black] hover:bg-white transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                ← Back to Challenges
              </button>
            </div>

            {/* CHALLENGE INFO CARD */}
            <div className="border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_black]">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-black text-white px-2.5 py-1">
                    {selectedChallenge.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black mt-3 leading-tight">{selectedChallenge.title}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="border-2 border-black px-3.5 py-1 text-sm font-bold text-black shadow-[2px_2px_0_black]"
                    style={{ backgroundColor: getDifficultyColor(selectedChallenge.difficulty) }}
                  >
                    {formatDifficulty(selectedChallenge.difficulty)}
                  </span>
                  <div className="border-4 border-black bg-[#FFD23F] text-black font-extrabold px-5 py-2.5 text-xl shadow-[4px_4px_0_black]">
                    {selectedChallenge.points} Points
                  </div>
                </div>
              </div>
            </div>

            {/* TAB OPTIONS */}
            <div className="flex border-4 border-black bg-black shadow-[6px_6px_0_black] w-full md:w-fit">
              <button
                onClick={() => {
                  setActiveTab("description");
                  setError("");
                  setSuccess(false);
                }}
                className={`flex-1 md:flex-none px-6 py-3 font-black text-lg border-r-4 border-black transition-colors ${
                  activeTab === "description" ? "bg-[#FF5D8F] text-black" : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                Challenge Description
              </button>
              <button
                onClick={() => {
                  setActiveTab("submission");
                  setError("");
                  setSuccess(false);
                }}
                className={`flex-1 md:flex-none px-6 py-3 font-black text-lg transition-colors ${
                  activeTab === "submission" ? "bg-[#00B7FF] text-white" : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                Solution Submission
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="border-4 border-black bg-white p-6 md:p-8 shadow-[10px_10px_0_black] space-y-6">
              {activeTab === "description" ? (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-black mb-3">Overview</h2>
                    <p className="font-medium text-gray-700 leading-relaxed text-lg">
                      {selectedChallenge.description}
                    </p>
                  </div>

                  {/* Requirements */}
                  {requirementsList.length > 0 && (
                    <div className="border-t-2 border-dashed border-gray-300 pt-4">
                      <h2 className="text-2xl font-black mb-3">Requirements</h2>
                      <ul className="list-none space-y-2.5 font-medium text-gray-800">
                        {requirementsList.map((req, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <span className="text-red-500 font-extrabold text-xl">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies required */}
                  {techList.length > 0 && (
                    <div className="border-t-2 border-dashed border-gray-300 pt-4">
                      <h2 className="text-2xl font-black mb-3">Target Technologies</h2>
                      <div className="flex flex-wrap gap-2">
                        {techList.map((tech) => (
                          <span
                            key={tech}
                            className="border-2 border-black bg-[#FFF8E7] px-3.5 py-1.5 text-sm font-bold text-black"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {resourcesList.length > 0 && (
                    <div className="border-t-2 border-dashed border-gray-300 pt-4">
                      <h2 className="text-2xl font-black mb-3">Resources</h2>
                      <div className="flex flex-wrap gap-2">
                        {resourcesList.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-black bg-[#FFF8E7] px-4 py-2.5 text-sm font-bold shadow-[2px_2px_0_black] hover:bg-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                          >
                            Resource {idx + 1} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {isSelectedSubmitted && !forceShowForm ? (
                    <div className="border-4 border-black bg-[#7AE582] p-6 shadow-[6px_6px_0_black] text-center">
                      <h4 className="text-2xl font-black">
                        {success ? "Solution Submitted!" : "Solution Already Submitted!"}
                      </h4>
                      <p className="mt-2 font-medium text-sm md:text-base mb-6">
                        You have successfully shipped your project. You can check score evaluations, rank, and reviewer feedback on the{" "}
                        <Link to="/submissions" className="underline font-bold text-black">
                          Submissions Dashboard
                        </Link>.
                      </p>
                      <button
                        onClick={() => {
                          setForceShowForm(true);
                          setSuccess(false);
                          setError("");
                        }}
                        className="border-4 border-black bg-white px-6 py-2.5 font-extrabold shadow-[4px_4px_0_black] hover:bg-gray-100 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-black cursor-pointer inline-block"
                      >
                        Submit Solution Again
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmission} className="space-y-5">
                      <h2 className="text-2xl font-black border-b-4 border-black pb-3">
                        {isSelectedSubmitted ? "Resubmit Project Solution" : "Submit Project Solution"}
                      </h2>

                      {error && (
                        <div className="border-2 border-black bg-[#FF595E] p-3 text-sm font-bold text-black shadow-[2px_2px_0_black]">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="border-2 border-black bg-[#7AE582] p-3 text-sm font-bold text-black shadow-[2px_2px_0_black]">
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
                          rows={4}
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

                      <div className="flex gap-4 mt-2 flex-wrap">
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 min-w-[200px]"
                        >
                          {submitting ? "Submitting..." : (isSelectedSubmitted ? "Resubmit Solution" : "Submit Project Solution")}
                        </Button>
                        {isSelectedSubmitted && (
                          <button
                            type="button"
                            onClick={() => {
                              setForceShowForm(false);
                              setSuccess(false);
                              setError("");
                            }}
                            disabled={submitting}
                            className="border-4 border-black bg-white px-6 py-2.5 font-extrabold shadow-[4px_4px_0_black] hover:bg-gray-100 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-black cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
