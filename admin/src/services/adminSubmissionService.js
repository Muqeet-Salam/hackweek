import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

const SUBMISSIONS_COLLECTION = "submissions";

export const subscribeToSubmissions = (callback) => {
  const q = query(collection(db, SUBMISSIONS_COLLECTION), orderBy("submittedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  }, (error) => {
    console.error("Error fetching submissions:", error);
  });
};

export const verifySubmission = async (submissionId, score, status, feedback) => {
  try {
    const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
    await updateDoc(submissionRef, {
      score: Number(score),
      status: status, // e.g. "verified", "rejected"
      feedback: feedback || "",
      reviewedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error verifying submission:", error);
    throw error;
  }
};
