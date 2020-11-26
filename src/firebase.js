import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "",
  authDomain: "insta-clone-d0cb8.firebaseapp.com",
  databaseURL: "https://insta-clone-d0cb8.firebaseio.com",
  projectId: "insta-clone-d0cb8",
  storageBucket: "insta-clone-d0cb8.appspot.com",
  messagingSenderId: "603536240514",
  appId: "1:603536240514:web:f759201cb504de370e299b",
  measurementId: "G-4LN7MNRGVL"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

// export default db;