import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvATdgMRL9FJBR8F-3VsK7TsI5bdn9KHY",
  authDomain: "hackweek-8f195.firebaseapp.com",
  projectId: "hackweek-8f195",
  storageBucket: "hackweek-8f195.firebasestorage.app",
  messagingSenderId: "59638151972",
  appId: "1:59638151972:web:6e70894739c9c1541951b1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  console.log("Attempting to connect to Firestore on project: hackweek-8f195...");
  try {
    const querySnapshot = await getDocs(collection(db, "admin_users"));
    console.log("SUCCESS! Connected to Firestore.");
    console.log(`Found ${querySnapshot.docs.length} documents in 'admin_users' collection.`);
    querySnapshot.forEach((doc) => {
      console.log(`Doc ID: ${doc.id} =>`, doc.data());
    });
  } catch (error) {
    console.error("ERROR CONNECTING TO FIRESTORE:");
    console.error(error.message);
  }
}

testConnection();
