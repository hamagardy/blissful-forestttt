import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBwuRNSNIYFEHi8tatgCfrEw1p9FG22Uco",
  authDomain: "gardio-738fc.firebaseapp.com",
  projectId: "gardio-738fc",
  storageBucket: "gardio-738fc.appspot.com",
  messagingSenderId: "673960985156",
  appId: "1:673960985156:web:8188ab3ec6d79892977211",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db }; // Export both auth and db
