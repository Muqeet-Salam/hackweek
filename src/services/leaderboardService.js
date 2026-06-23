import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

const USERS_COLLECTION = "users";
const SUBMISSIONS_COLLECTION = "submissions";

export const getLeaderboardData = async () => {
  try {
    // Fetch all users
    const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch verified submissions
    const q = query(collection(db, SUBMISSIONS_COLLECTION), where("status", "==", "verified"));
    const submissionsSnapshot = await getDocs(q);
    const submissions = submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const userScores = {};

    users.forEach((user) => {
      userScores[user.uid] = {
        uid: user.uid,
        username: user.username || user.fullName || "Builder",
        avatarUrl: user.avatarUrl || user.photoURL || null,
        totalScore: 0,
        verifiedSubmissions: 0,
      };
    });

    submissions.forEach((sub) => {
      if (sub.score && userScores[sub.userId]) {
        userScores[sub.userId].totalScore += Number(sub.score);
        userScores[sub.userId].verifiedSubmissions += 1;
      }
    });

    // Filter out users with 0 points if desired, or keep everyone. Let's keep everyone who has > 0 points or just keep everyone for now and sort.
    const leaderboard = Object.values(userScores)
      //.filter(u => u.totalScore > 0) // Uncomment to only show users with points
      .sort((a, b) => b.totalScore - a.totalScore);

    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
};
