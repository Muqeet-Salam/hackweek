import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const SETTINGS_DOC = doc(db, "settings", "general");

export const getSettings = async () => {
  const snapshot = await getDoc(SETTINGS_DOC);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return { challengesLive: false };
};

export const updateSettings = async (newSettings) => {
  await setDoc(SETTINGS_DOC, newSettings, { merge: true });
};

export const subscribeToSettings = (callback) => {
  return onSnapshot(SETTINGS_DOC, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback({ challengesLive: false });
    }
  });
};
