import { useState, useEffect } from "react";
import { subscribeToSubmissions, verifySubmission } from "../services/adminSubmissionService";
import { subscribeToChallenges } from "../services/adminChallengeService";
import { updateSettings, subscribeToSettings } from "../services/adminSettingsService";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallengeId, setSelectedChallengeId] = useState("all");
  const [expandedIds, setExpandedIds] = useState({});
  const [isScoresLive, setIsScoresLive] = useState(false);

  useEffect(() => {
    const unsubscribeSubmissions = subscribeToSubmissions((data) => {
      setSubmissions(data);
      setLoading(false);
    });
    
    const unsubscribeChallenges = subscribeToChallenges((data) => {
      setChallenges(data);
    });

    const unsubscribeSettings = subscribeToSettings((settings) => {
      setIsScoresLive(settings.scoresLive === true);
    });

    return () => {
      unsubscribeSubmissions();
      unsubscribeChallenges();
      unsubscribeSettings();
    };
  }, []);

  const handleToggleScoresLive = async () => {
    try {
      await updateSettings({ scoresLive: !isScoresLive });
    } catch (err) {
      alert("Failed to toggle scores live status.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVerify = async (id, currentScore) => {
    const scoreStr = prompt("Enter score (0-100):", currentScore || "");
    if (scoreStr === null) return;
    
    const feedback = prompt("Enter feedback (optional):", "") || "";
    
    try {
      await verifySubmission(id, scoreStr, "verified", feedback);
      alert("Submission verified!");
    } catch (error) {
      alert("Failed to verify submission.");
    }
  };

  const filteredSubmissions = selectedChallengeId === "all" 
    ? submissions 
    : submissions.filter(sub => sub.challengeId === selectedChallengeId);

  const getChallengeTitle = (id) => {
    const challenge = challenges.find(c => c.id === id);
    return challenge ? challenge.title : `Challenge ID: ${id}`;
  };

  if (loading) return <div className="text-2xl font-bold p-8 animate-pulse">Loading submissions...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-4xl font-extrabold">Review Submissions</h2>
        
        <div className="flex items-center gap-4 bg-[#f4f4f4] border-4 border-black p-3 shadow-[4px_4px_0_black]">
          <div>
            <p className="font-bold text-lg">Scores Go Live</p>
            <p className="text-xs text-gray-600">Publish scores to users</p>
          </div>
          <button
            onClick={handleToggleScoresLive}
            className={`px-4 py-2 font-bold border-4 border-black transition-colors ${
              isScoresLive ? "bg-[#7AE582] text-black" : "bg-[#FF595E] text-white"
            }`}
          >
            {isScoresLive ? "ONLINE" : "OFFLINE"}
          </button>
        </div>
      </div>
      
      {/* Challenge Filters / Tabs */}
      <div className="flex flex-wrap gap-4 border-b-4 border-black pb-4">
        <button
          onClick={() => setSelectedChallengeId("all")}
          className={`px-6 py-2 font-bold border-4 border-black shadow-[4px_4px_0_black] transition-transform hover:-translate-y-1 ${
            selectedChallengeId === "all" ? "bg-[#FFD23F] text-black" : "bg-white text-gray-700"
          }`}
        >
          All Submissions
        </button>
        
        {challenges.map(challenge => (
          <button
            key={challenge.id}
            onClick={() => setSelectedChallengeId(challenge.id)}
            className={`px-6 py-2 font-bold border-4 border-black shadow-[4px_4px_0_black] transition-transform hover:-translate-y-1 ${
              selectedChallengeId === challenge.id ? "bg-[#00B7FF] text-white" : "bg-white text-gray-700"
            }`}
          >
            {challenge.title}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredSubmissions.length === 0 ? (
          <div className="border-4 border-black bg-white p-12 text-center shadow-[8px_8px_0_black]">
            <p className="font-bold text-2xl">No submissions found for this selection.</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const isExpanded = expandedIds[sub.id];
            return (
              <div key={sub.id} className="border-4 border-black bg-white shadow-[8px_8px_0_black] flex flex-col">
                {/* Header (Always Visible) */}
                <div 
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(sub.id)}
                >
                  <div className="space-y-2 flex-grow">
                    <div className="flex gap-2 mb-2">
                      <Badge variant={sub.status === 'verified' ? 'success' : 'warning'}>
                        {sub.status.toUpperCase()}
                      </Badge>
                      {sub.score !== undefined && (
                        <Badge variant="pink">{sub.score} Points</Badge>
                      )}
                      <Badge variant="info">{getChallengeTitle(sub.challengeId)}</Badge>
                    </div>
                    <h3 className="text-3xl font-extrabold">{sub.projectName || "Untitled Project"}</h3>
                    <p className="font-medium text-gray-700">User ID: {sub.userId}</p>
                  </div>
                  
                  <div className="flex-shrink-0 self-start md:self-center flex flex-col items-end gap-2">
                    <Button 
                      onClick={(e) => { e.stopPropagation(); handleVerify(sub.id, sub.score); }} 
                      className="bg-[#FFD23F] text-black shadow-[4px_4px_0_black] hover:shadow-[6px_6px_0_black] transition-shadow text-lg py-2 px-6"
                    >
                      Verify & Score
                    </Button>
                    <span className="text-sm font-bold underline cursor-pointer text-gray-500">
                      {isExpanded ? "Hide Details ↑" : "Show Details ↓"}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 border-t-4 border-black bg-[#f9f9f9]">
                    {sub.tagline && <p className="font-bold text-xl italic text-gray-800 border-l-4 border-[#FFD23F] pl-3 my-2">{sub.tagline}</p>}
                    
                    {sub.teamMembers && sub.teamMembers.length > 0 && (
                      <p className="font-medium text-gray-700 mt-2">Team: {sub.teamMembers.join(", ")}</p>
                    )}
                    
                    {sub.techStack && sub.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {sub.techStack.map((tech, idx) => (
                          <span key={idx} className="bg-black text-white px-2 py-0.5 text-xs font-bold">{tech}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-4 mt-6 flex-wrap">
                      {sub.githubRepo && (
                        <a href={sub.githubRepo} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-blue-600 underline font-bold bg-white px-3 py-1 border-2 border-black">GitHub Repo</a>
                      )}
                      {sub.liveAppUrl && (
                        <a href={sub.liveAppUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-blue-600 underline font-bold bg-white px-3 py-1 border-2 border-black">Live Project</a>
                      )}
                      {sub.projectUrl && !sub.liveAppUrl && (
                        <a href={sub.projectUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-blue-600 underline font-bold bg-white px-3 py-1 border-2 border-black">Live Project</a>
                      )}
                      {sub.videoDemoUrl && (
                        <a href={sub.videoDemoUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-blue-600 underline font-bold bg-white px-3 py-1 border-2 border-black">Video Demo</a>
                      )}
                    </div>
                    
                    {sub.story ? (
                      <div className="mt-8 border-4 border-black p-6 bg-white">
                        <h4 className="font-extrabold mb-4 text-2xl">The Story</h4>
                        <p className="font-medium whitespace-pre-wrap">{sub.story}</p>
                      </div>
                    ) : sub.description ? (
                      <div className="mt-6 border-l-4 border-black pl-4 font-medium text-lg bg-white p-4">
                        {sub.description}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
