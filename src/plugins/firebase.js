import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyAZpqTlubNCKIRaQew1a5p2gjpjyGf5foY",
  authDomain: "neetschat.firebaseapp.com",
  databaseURL: "https://neetschat.firebaseio.com",
  projectId: "neetschat",
  storageBucket: "neetschat.appspot.com",
  messagingSenderId: "770786929433"
});

export default firebase;
