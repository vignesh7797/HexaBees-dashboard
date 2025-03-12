// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD40meOA707EKt9Df0qBbqZBo0YbozsqmI",
  authDomain: "hexabees-enterprise.firebaseapp.com",
  projectId: "hexabees-enterprise",
  storageBucket: "hexabees-enterprise.firebasestorage.app",
  messagingSenderId: "885142217183",
  appId: "1:885142217183:web:9bb3ccc4a5bb0291fc246a"
};

// Initialize Firebase
const app = !getApps().length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);