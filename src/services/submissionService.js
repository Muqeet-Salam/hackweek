import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const SUBMISSIONS_COLLECTION = "submissions";

export const submitProject = async (submissionData) => {
  try {
    const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
      ...submissionData,
      status: "pending",
      submittedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting project:", error);
    throw error;
  }
};

export const checkUserSubmission = async (userId, challengeId) => {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where("userId", "==", userId),
      where("challengeId", "==", challengeId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error checking user submission:", error);
    return null;
  }
};

export const getUserSubmissions = async (userId) => {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user submissions:", error);
    return [];
  }
};
