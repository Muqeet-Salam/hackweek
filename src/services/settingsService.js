import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const SETTINGS_DOC = doc(db, "settings", "general");

export const subscribeToSettings = (callback) => {
  return onSnapshot(SETTINGS_DOC, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback({ challengesLive: false });
    }
  });
};
