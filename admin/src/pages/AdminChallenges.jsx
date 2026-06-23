import { useState, useEffect } from "react";
import { createChallenge, subscribeToChallenges, deleteChallenge } from "../services/adminChallengeService";
import { getSettings, updateSettings, subscribeToSettings } from "../services/adminSettingsService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";

export default function AdminChallenges() {
  const [activeTab, setActiveTab] = useState("manage"); // 'manage' or 'create'
  const [challenges, setChallenges] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    problemStatement: "",
    category: "Frontend",
    difficulty: "Beginner",
    points: 100,
    requirements: "",
    judgingCriteria: "",
    resources: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribeChallenges = subscribeToChallenges((data) => {
      setChallenges(data);
    });

    const unsubscribeSettings = subscribeToSettings((settings) => {
      setIsLive(settings.challengesLive === true);
    });

    return () => {
      unsubscribeChallenges();
      unsubscribeSettings();
    };
  }, []);

  const handleToggleLive = async () => {
    try {
      await updateSettings({ challengesLive: !isLive });
    } catch (err) {
      alert("Failed to toggle live status.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const challengeData = {
        ...formData,
        requirements: formData.requirements.split("\n").filter(r => r.trim() !== ""),
        points: Number(formData.points)
      };
      await createChallenge(challengeData);
      alert("Challenge created successfully!");
      setFormData({
        title: "", slug: "", shortDescription: "", description: "", problemStatement: "", category: "Frontend", difficulty: "Beginner", points: 100, requirements: "", judgingCriteria: "", resources: ""
      });
      setActiveTab("manage");
    } catch (error) {
      alert("Failed to create challenge.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      try {
        await deleteChallenge(id);
      } catch (error) {
        alert("Failed to delete challenge.");
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Tabs Navbar */}
      <div className="flex gap-4 border-b-4 border-black pb-4">
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-6 py-3 font-bold border-4 border-black shadow-[4px_4px_0_black] transition-transform ${
            activeTab === "manage" ? "bg-[#00B7FF] text-white" : "bg-white hover:-translate-y-1"
          }`}
        >
          Manage Challenges
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-6 py-3 font-bold border-4 border-black shadow-[4px_4px_0_black] transition-transform ${
            activeTab === "create" ? "bg-[#7AE582] text-black" : "bg-white hover:-translate-y-1"
          }`}
        >
          Create New Challenge
        </button>
      </div>

      {/* Manage Tab */}
      {activeTab === "manage" && (
        <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0_black]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-4xl font-extrabold">Manage Challenges</h2>
            
            <div className="flex items-center gap-4 bg-[#f4f4f4] border-4 border-black p-4 shadow-[4px_4px_0_black]">
              <div>
                <p className="font-bold text-lg">Go Live Status</p>
                <p className="text-sm text-gray-600">Toggle visibility for users</p>
              </div>
              <button
                onClick={handleToggleLive}
                className={`px-6 py-2 font-bold border-4 border-black transition-colors ${
                  isLive ? "bg-[#7AE582] text-black" : "bg-[#FF595E] text-white"
                }`}
              >
                {isLive ? "ONLINE" : "OFFLINE"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {challenges.length === 0 ? (
              <div className="text-center py-8 border-4 border-dashed border-gray-400">
                <p className="font-medium text-xl text-gray-500">No challenges created yet.</p>
                <Button className="mt-4 bg-[#00B7FF] text-white" onClick={() => setActiveTab("create")}>
                  Create your first challenge
                </Button>
              </div>
            ) : (
              challenges.map((challenge) => (
                <div key={challenge.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-4 border-black p-4 bg-[#f4f4f4] shadow-[4px_4px_0_black] gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">{challenge.title}</h3>
                    <p className="text-gray-700 font-medium mt-1">
                      <span className="bg-white border-2 border-black px-2 py-0.5 text-xs mr-2">{challenge.category}</span>
                      <span className="bg-white border-2 border-black px-2 py-0.5 text-xs mr-2">{challenge.difficulty}</span>
                      <span className="bg-[#FFD23F] border-2 border-black px-2 py-0.5 text-xs font-bold">{challenge.points} PTS</span>
                    </p>
                  </div>
                  <Button variant="danger" onClick={() => handleDelete(challenge.id)}>Delete</Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0_black]">
          <h2 className="text-4xl font-extrabold mb-8">Create New Challenge</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-2">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Neo Brutalism Landing Page" />
              </div>
              <div>
                <label className="block font-bold mb-2">Slug (URL-friendly)</label>
                <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="e.g. neo-brutalism-landing" />
              </div>
              <div>
                <label className="block font-bold mb-2">Category</label>
                <Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Fullstack</option>
                  <option>Design</option>
                </Select>
              </div>
              <div>
                <label className="block font-bold mb-2">Difficulty</label>
                <Select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </Select>
              </div>
              <div>
                <label className="block font-bold mb-2">Points</label>
                <Input required type="number" min="10" step="10" value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Short Description (Elevator Pitch)</label>
              <Input required value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} placeholder="A quick one-sentence summary of the challenge" />
            </div>

            <div>
              <label className="block font-bold mb-2">Full Description</label>
              <Textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the challenge in detail..." />
            </div>

            <div>
              <label className="block font-bold mb-2">Problem Statement</label>
              <Textarea required rows={4} value={formData.problemStatement} onChange={e => setFormData({...formData, problemStatement: e.target.value})} placeholder="What is the exact problem they need to solve?" />
            </div>

            <div>
              <label className="block font-bold mb-2">Requirements (One per line)</label>
              <Textarea rows={4} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} placeholder="- Must use React&#10;- Must be fully responsive" />
            </div>

            <div>
              <label className="block font-bold mb-2">Judging Criteria</label>
              <Textarea rows={4} value={formData.judgingCriteria} onChange={e => setFormData({...formData, judgingCriteria: e.target.value})} placeholder="How will this be judged? e.g. Innovation, UI/UX" />
            </div>

            <div>
              <label className="block font-bold mb-2">Resources (Links, APIs, Docs)</label>
              <Textarea rows={4} value={formData.resources} onChange={e => setFormData({...formData, resources: e.target.value})} placeholder="Helpful links for participants to get started" />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-[#7AE582] text-xl py-4 mt-4">
              {submitting ? "Uploading..." : "Upload Challenge"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
