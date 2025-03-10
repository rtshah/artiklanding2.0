// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIZaSYA6P5Tj17Ek-pqypdv57Sr4ak_LGx7bL_M",
  authDomain: "artiklanding2.firebaseapp.com",
  projectId: "artiklanding2",
  storageBucket: "artiklanding2.firebasestorage.app",
  messagingSenderId: "706256254956",
  appId: "1:706256254956:web:7b442806cb9ddd0c1132c9",
  measurementId: "G-QL64V7QEBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Function to add a waitlist entry
export async function addToWaitlist(data) {
  try {
    const docRef = await addDoc(collection(db, "waitlist"), {
      name: data.name,
      workEmail: data.workEmail,
      marketingBudget: data.marketingBudget,
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
} 