import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const CHALLENGES_COLLECTION = "challenges";

export const subscribeToChallenges = (callback) => {
  const q = query(collection(db, CHALLENGES_COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  }, (error) => {
    console.error("Error fetching challenges:", error);
  });
};

export const subscribeToChallengeBySlug = (slug, callback) => {
  const q = query(collection(db, CHALLENGES_COLLECTION), where("slug", "==", slug));
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }
    const docData = snapshot.docs[0];
    callback({
      id: docData.id,
      ...docData.data()
    });
  }, (error) => {
    console.error("Error fetching challenge by slug:", error);
  });
};
