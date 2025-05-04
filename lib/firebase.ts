// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import * as admin from "firebase-admin";
// const serviceAccount = require("../src/app/hexabees-enterprise-firebase-adminsdk.json")
import serviceAccount from "../src/app/hexabees-enterprise-firebase-adminsdk.json";

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

// var serviceAccount = require("path/to/serviceAccountKey.json");

if(!admin.apps.length){
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseConfig.projectId,
      clientEmail: "vigneshwaran7797@gmail.com",
      privateKey: serviceAccount.private_key?.replace(/\\n/g, "\n"),
    }),
    storageBucket: firebaseConfig.storageBucket,
  })
}

// Initialize Firebase
const app = !getApps().length ?  initializeApp(firebaseConfig) : getApp();

const bucket = admin.storage().bucket();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { bucket };
