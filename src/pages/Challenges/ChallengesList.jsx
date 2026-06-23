import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscribeToChallenges } from "../../services/challengeService";
import { subscribeToSettings } from "../../services/settingsService";
import { getUserSubmissions } from "../../services/submissionService";
import { useAuthStore } from "../../store/authstore";
import Badge from "../../components/ui/Badge";

export default function ChallengesList() {
  const user = useAuthStore((state) => state.user);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [submittedChallengeIds, setSubmittedChallengeIds] = useState([]);

  const isNewChallenge = (createdAt) => {
    if (!createdAt || !user) return false;
    let challengeDate;
    if (createdAt.toMillis) {
      challengeDate = createdAt.toMillis();
    } else if (createdAt.seconds) {
      challengeDate = createdAt.seconds * 1000;
    } else {
      challengeDate = new Date(createdAt).getTime();
    }
    
    // Check if the user has a lastSignInTime
    if (user.metadata && user.metadata.lastSignInTime) {
      const lastSignIn = new Date(user.metadata.lastSignInTime).getTime();
      return challengeDate > lastSignIn;
    }
    
    return false;
  };

  useEffect(() => {
    const unsubscribeChallenges = subscribeToChallenges((data) => {
      setChallenges(data);
      setLoading(false);
    });
    
    const unsubscribeSettings = subscribeToSettings((settings) => {
      setIsLive(settings.challengesLive === true);
    });
    
    return () => {
      unsubscribeChallenges();
      unsubscribeSettings();
    };
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (user) {
        const submissions = await getUserSubmissions(user.uid);
        setSubmittedChallengeIds(submissions.map(sub => sub.challengeId));
      } else {
        setSubmittedChallengeIds([]);
      }
    };
    fetchSubmissions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <h2 className="text-3xl font-extrabold animate-pulse">Loading Challenges...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="border-4 border-black p-6 bg-[#00B7FF] shadow-[10px_10px_0_black]">
        <h1 className="text-5xl font-extrabold text-white" style={{textShadow: "4px 4px 0 black"}}>
          Challenges
        </h1>
        <p className="mt-4 text-xl font-bold border-2 border-black bg-white inline-block px-4 py-2 shadow-[4px_4px_0_black]">
          Pick a challenge, build something awesome, and submit your project!
        </p>
      </section>

      {!isLive ? (
        <div className="border-4 border-black bg-[#FFD23F] p-12 text-center shadow-[10px_10px_0_black]">
          <h2 className="text-4xl font-extrabold mb-4">Challenges are coming soon!</h2>
          <p className="text-2xl font-bold">The HackWeek team is preparing the challenges. Check back shortly!</p>
        </div>
      ) : challenges.length === 0 ? (
        <div className="border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0_black]">
          <h3 className="text-2xl font-bold">No challenges available yet. Check back soon!</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Link
              key={challenge.id}
              to={`/challenges/${challenge.slug}`}
              className="block border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0_black]"
            >
              <div className="mb-4 flex flex-wrap gap-2">
                {isNewChallenge(challenge.createdAt) && (
                  <Badge variant="info" className="bg-[#00B7FF] text-white">NEW ✨</Badge>
                )}
                <Badge variant="warning">{challenge.difficulty}</Badge>
                <Badge variant="pink">{challenge.points} PTS</Badge>
                {submittedChallengeIds.includes(challenge.id) && (
                  <Badge variant="success">Submitted ✅</Badge>
                )}
              </div>
              <h2 className="text-2xl font-extrabold mb-2">{challenge.title}</h2>
              <p className="text-gray-700 font-medium line-clamp-3 mb-4">
                {challenge.description}
              </p>
              <div className="font-bold text-sm bg-[#FFD23F] border-2 border-black inline-block px-2 py-1">
                {challenge.category}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
