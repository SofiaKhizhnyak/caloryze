import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDA5megd2_yNEIuNN8F0-d1eBgrWC2E2wM",
  authDomain: "caloryze-d43dc.firebaseapp.com",
  projectId: "caloryze-d43dc",
  storageBucket: "caloryze-d43dc.firebasestorage.app",
  messagingSenderId: "490663452808",
  appId: "1:490663452808:web:e7fd6de72ddf1e7c657f3d",
  measurementId: "G-WTPB5D5CH3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
