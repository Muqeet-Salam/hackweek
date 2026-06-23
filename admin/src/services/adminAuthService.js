import { collection, query, where, getDocs, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const ADMIN_COLLECTION = "admin_users";

export const loginAdmin = async (username, password) => {
  try {
    const q = query(
      collection(db, ADMIN_COLLECTION),
      where("username", "==", username),
      where("password", "==", password)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Login successful
      const adminData = snapshot.docs[0].data();
      localStorage.setItem("admin_auth", JSON.stringify({ username: adminData.username }));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin_auth");
};

export const isAuthenticated = () => {
  return localStorage.getItem("admin_auth") !== null;
};

export const subscribeToAdmins = (callback) => {
  const q = query(collection(db, ADMIN_COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  }, (error) => {
    console.error("Error fetching admins:", error);
  });
};

export const createAdmin = async (username, password) => {
  try {
    const docRef = await addDoc(collection(db, ADMIN_COLLECTION), {
      username,
      password,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    await deleteDoc(doc(db, ADMIN_COLLECTION, adminId));
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};
