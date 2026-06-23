import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";

const USERS_COLLECTION = "users";

export const getRegistrations = async () => {
  try {
    const q = query(collection(db, USERS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error;
  }
};
