import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

const CHALLENGES_COLLECTION = "challenges";

export const createChallenge = async (challengeData) => {
  try {
    const docRef = await addDoc(collection(db, CHALLENGES_COLLECTION), {
      ...challengeData,
      participantsCount: 0,
      status: "active",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating challenge:", error);
    throw error;
  }
};

export const subscribeToChallenges = (callback) => {
  const q = query(collection(db, CHALLENGES_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  }, (error) => {
    console.error("Error fetching admin challenges:", error);
  });
};

export const deleteChallenge = async (challengeId) => {
  try {
    await deleteDoc(doc(db, CHALLENGES_COLLECTION, challengeId));
  } catch (error) {
    console.error("Error deleting challenge:", error);
    throw error;
  }
};
