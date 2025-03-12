import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMGn9lg0cCc-FMezmKI9cM9gIlUo7Pq2M",
  authDomain: "workarena-login.firebaseapp.com",
  projectId: "workarena-login",
  storageBucket: "workarena-login.firebasestorage.app",
  messagingSenderId: "868291935347",
  appId: "1:868291935347:web:037e90a5397b34866c7e06"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
