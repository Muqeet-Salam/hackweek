import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Send } from "lucide-react";
import { db } from "../firebase/config";
import { useAuthStore } from "../store/authstore";

const RatingRow = ({ title, value, setValue }) => {
  return (
    <div className="space-y-3">
      <p className="font-bold text-lg">{title}</p>

      <div className="flex gap-3">

        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setValue(num)}
            className={`w-12 h-12 border-4 border-black font-black text-lg shadow-[4px_4px_0_black] transition hover:-translate-y-1 ${
              value === num
                ? "bg-[#FF595E] text-white"
                : "bg-[#FFF8E7] hover:bg-[#FFD23F]"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function Feedback() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const displayName = useMemo(() => {
    return profile?.name || user?.displayName || "Participant";
  }, [profile, user]);

  const [challengeQuality, setChallengeQuality] = useState(null);
  const [platformExperience, setPlatformExperience] = useState(null);
  const [mentorSupport, setMentorSupport] = useState(null);
  const [overallSatisfaction, setOverallSatisfaction] = useState(null);

  const [enjoyedMost, setEnjoyedMost] = useState("");
  const [improvements, setImprovements] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [participateAgain, setParticipateAgain] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !enjoyedMost.trim() ||
      !improvements.trim() ||
      !suggestions.trim() ||
      !participateAgain.trim() ||
      submitting
    ) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await addDoc(collection(db, "feedback"), {
        userId: user?.uid || null,
        displayName,
        email: user?.email || profile?.email || null,

        eventId: "hackweek-2026",

        ratings: {
          challengeQuality,
          platformExperience,
          mentorSupport,
          overallSatisfaction,
        },

        responses: {
          enjoyedMost,
          improvements,
          suggestions,
          participateAgain,
        },

        createdAt: serverTimestamp(),
      });

      setChallengeQuality(null);
      setPlatformExperience(null);
      setMentorSupport(null);
      setOverallSatisfaction(null);

      setEnjoyedMost("");
      setImprovements("");
      setSuggestions("");
      setParticipateAgain("");

      setSuccess("Thank you for your feedback! Your response has been submitted.");
    } catch (err) {
      console.error("Feedback submission failed:", err);
      setError("Unable to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="border-4 border-black bg-white p-8 shadow-[12px_12px_0_black] space-y-8"
      >
        {/* Header */}

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-block border-4 border-black bg-[#FFD23F] px-4 py-2 font-extrabold shadow-[4px_4px_0_black] hover:-translate-y-1 transition"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-5xl md:text-6xl font-black">
            Share Your Experience
          </h1>
        </div>

        {(error || success) && (
          <div
            className={`border-4 border-black px-5 py-4 font-bold shadow-[4px_4px_0_black] ${
              error
                ? "bg-[#FF595E] text-white"
                : "bg-[#7AE582] text-black"
            }`}
          >
            {error || success}
          </div>
        )}

        {/* Rating Section */}

        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-black">
              Rate Your Experience
            </h2>

            <p className="mt-2 text-black/70 font-medium">
              Click on the respective numbers (1–5) to select your score.
              <br />
              <span className="font-bold">
                1 = Lowest, 5 = Highest
              </span>
            </p>
          </div>

          <RatingRow
            title="Challenge Quality & Fun"
            value={challengeQuality}
            setValue={setChallengeQuality}
          />

          <RatingRow
            title="Platform & Submission Experience"
            value={platformExperience}
            setValue={setPlatformExperience}
          />

          <RatingRow
            title="Mentor Support & Communication"
            value={mentorSupport}
            setValue={setMentorSupport}
          />

          <RatingRow
            title="Overall Event Satisfaction"
            value={overallSatisfaction}
            setValue={setOverallSatisfaction}
          />
        </section>

        {/* Reflection Questions */}

        <section className="space-y-8">
          <div className="space-y-2">
            <label className="block text-xl font-black">
              1. What did you enjoy most about HackWeek 2026?
            </label>

            <textarea
              required
              rows={5}
              value={enjoyedMost}
              onChange={(e) => setEnjoyedMost(e.target.value)}
              placeholder="Tell us what stood out the most during the event..."
              className="w-full resize-none border-4 border-black bg-[#FFF8E7] p-4 font-medium outline-none shadow-[4px_4px_0_black]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-black">
              2. What could be improved for next time?
            </label>

            <textarea
              required
              rows={5}
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="Share any areas that could be improved..."
              className="w-full resize-none border-4 border-black bg-[#FFF8E7] p-4 font-medium outline-none shadow-[4px_4px_0_black]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-black">
              3. General comments / suggestions for the team
            </label>

            <textarea
              required
              rows={5}
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="Any additional feedback or suggestions..."
              className="w-full resize-none border-4 border-black bg-[#FFF8E7] p-4 font-medium outline-none shadow-[4px_4px_0_black]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-black">
              4. Would you participate in another COSC event? Why or why not?
            </label>

            <textarea
              required
              rows={5}
              value={participateAgain}
              onChange={(e) => setParticipateAgain(e.target.value)}
              placeholder="Tell us whether you'd join another COSC event and why..."
              className="w-full resize-none border-4 border-black bg-[#FFF8E7] p-4 font-medium outline-none shadow-[4px_4px_0_black]"
            />
          </div>
        </section>

        {/* Submit Button */}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 border-4 border-black bg-[#FF595E] px-8 py-4 font-extrabold text-white shadow-[6px_6px_0_black] transition hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}