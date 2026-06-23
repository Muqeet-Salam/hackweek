import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { subscribeToChallengeBySlug } from "../../services/challengeService";
import { submitProject, checkUserSubmission } from "../../services/submissionService";
import { useAuthStore } from "../../store/authstore";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

export default function ChallengeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [checkingSubmission, setCheckingSubmission] = useState(true);
  const [formData, setFormData] = useState({ 
    projectName: "",
    tagline: "",
    techStack: "",
    githubRepo: "", 
    videoDemoUrl: "",
    liveAppUrl: "", 
    story: "",
    teamMembers: ""
  });

  useEffect(() => {
    const unsubscribe = subscribeToChallengeBySlug(slug, (data) => {
      setChallenge(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [slug]);

  useEffect(() => {
    const verifySubmission = async () => {
      if (user && challenge) {
        setCheckingSubmission(true);
        const submission = await checkUserSubmission(user.uid, challenge.id);
        setExistingSubmission(submission);
        setCheckingSubmission(false);
      } else if (!user) {
        setCheckingSubmission(false);
        setExistingSubmission(null);
      }
    };
    verifySubmission();
  }, [user, challenge]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit.");
      return navigate("/login");
    }
    setSubmitting(true);
    try {
      await submitProject({
        ...formData,
        techStack: formData.techStack.split(",").map(t => t.trim()).filter(Boolean),
        teamMembers: formData.teamMembers.split(",").map(t => t.trim()).filter(Boolean),
        challengeId: challenge.id,
        userId: user.uid,
        eventId: "hackweek-2026"
      });
      alert("Project submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to submit project.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-2xl font-bold animate-pulse">Loading...</div>;
  }

  if (!challenge) {
    return (
      <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_black]">
        <h2 className="text-3xl font-extrabold mb-4">Challenge not found</h2>
        <Link to="/challenges" className="underline font-bold">Back to challenges</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Challenge Info */}
      <div className="lg:col-span-2 space-y-8">
        <div className="border-4 border-black bg-[#FFD23F] p-8 shadow-[10px_10px_0_black]">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="pink">{challenge.category}</Badge>
            <Badge variant="default">{challenge.difficulty}</Badge>
            <Badge variant="success">{challenge.points} Points</Badge>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">{challenge.title}</h1>
          <h2 className="text-2xl font-bold mb-4">{challenge.shortDescription}</h2>
          <p className="text-xl font-medium border-l-4 border-black pl-4">
            {challenge.description}
          </p>
        </div>

        {challenge.problemStatement && (
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black]">
            <h2 className="text-3xl font-extrabold mb-4">Problem Statement</h2>
            <p className="font-medium text-lg whitespace-pre-wrap">{challenge.problemStatement}</p>
          </div>
        )}

        {challenge.requirements && challenge.requirements.length > 0 && (
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black]">
            <h2 className="text-3xl font-extrabold mb-4">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 font-medium text-lg">
              {challenge.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {challenge.judgingCriteria && (
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black]">
            <h2 className="text-3xl font-extrabold mb-4">Judging Criteria</h2>
            <p className="font-medium text-lg whitespace-pre-wrap">{challenge.judgingCriteria}</p>
          </div>
        )}

        {challenge.resources && (
          <div className="border-4 border-black bg-[#00B7FF] text-white p-6 shadow-[8px_8px_0_black]">
            <h2 className="text-3xl font-extrabold mb-4" style={{textShadow: "2px 2px 0 black"}}>Resources & Docs</h2>
            <p className="font-medium text-lg whitespace-pre-wrap">{challenge.resources}</p>
          </div>
        )}
      </div>

      {/* Submission Form */}
      <div>
        {checkingSubmission ? (
          <div className="border-4 border-black bg-white p-6 shadow-[10px_10px_0_black] sticky top-8">
            <h2 className="text-3xl font-extrabold mb-4 animate-pulse">Checking status...</h2>
          </div>
        ) : existingSubmission ? (
          <div className="border-4 border-black bg-[#7AE582] p-6 shadow-[10px_10px_0_black] sticky top-8">
            <h2 className="text-3xl font-extrabold mb-4">Project Submitted! 🎉</h2>
            <p className="font-bold text-lg mb-4">You have already submitted your project for this challenge.</p>
            <div className="bg-white border-2 border-black p-4 mb-4">
              <p className="font-bold">Project Name:</p>
              <p>{existingSubmission.projectName}</p>
            </div>
            <Link to="/dashboard">
              <Button className="w-full bg-white text-black hover:bg-gray-100 border-2 border-black">
                View My Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border-4 border-black bg-[#FF5D8F] p-6 shadow-[10px_10px_0_black] sticky top-8">
            <h2 className="text-3xl font-extrabold text-white mb-6" style={{textShadow: "2px 2px 0 black"}}>
              Submit Project
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-white mb-2" style={{textShadow: "1px 1px 0 black"}}>Project Name</label>
                <Input required placeholder="Your awesome project" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} />
              </div>

              <div>
                <label className="block font-bold text-white mb-2" style={{textShadow: "1px 1px 0 black"}}>Tagline (Elevator Pitch)</label>
                <Input required placeholder="One sentence summary" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
              </div>

              <div>
                <label className="block font-bold text-white mb-2" style={{textShadow: "1px 1px 0 black"}}>Tech Stack</label>
                <Input required placeholder="React, Node.js, Firebase (comma separated)" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} />
              </div>

              <div>
                <label className="block font-bold text-white mb-2" style={{textShadow: "1px 1px 0 black"}}>GitHub Repo URL</label>
                <Input required type="url" placeholder="https://github.com/..." value={formData.githubRepo} onChange={e => setFormData({...formData, githubRepo: e.target.value})} />
              </div>

              <div>
                <label className="block font-bold text-white mb-2" style={{textShadow: "1px 1px 0 black"}}>Video Demo URL</label>
                <Input type="url" placeholder="YouTube/Vimeo (Optional)" value={formData.videoDemoUrl} onChange={e => setFormData({...formData, videoDemoUrl: e.target.value})} />
              </div>
              
              <div>
                <label className="block font-bold text-white mb-2" style={{textShadow: "1px 1px 0 black"}}>Live App URL</label>
                <Input type="url" placeholder="https://... (Optional)" value={formData.liveAppUrl} onChange={e => setFormData({...formData, liveAppUrl: e.target.value})} />
              </div>

              <div>
                <label className="block font-bold text-white mb-2" style={{textShadow: "1px 1px 0 black"}}>The Story</label>
                <Textarea required rows={5} placeholder="Inspiration, How we built it, Challenges..." value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} />
              </div>

              <div>
                <label className="block font-bold text-white mb-2" style={{textShadow: "1px 1px 0 black"}}>Team Members</label>
                <Input placeholder="Emails or names (comma separated)" value={formData.teamMembers} onChange={e => setFormData({...formData, teamMembers: e.target.value})} />
              </div>

              <Button type="submit" disabled={submitting} className="w-full mt-4 bg-[#7AE582] text-black hover:bg-green-400">
                {submitting ? "Submitting..." : "Submit Project"}
              </Button>

              {!user && (
                <p className="text-sm font-bold bg-black text-white p-2 mt-4 text-center">
                  You must be logged in to submit.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
