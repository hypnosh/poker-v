import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcbcAIdtEhfO9jlEs2MsmhvWFc6SP-Qdg",
  authDomain: "poker-video.firebaseapp.com",
  databaseURL: "https://poker-video.firebaseio.com",
  projectId: "poker-video",
  storageBucket: "poker-video.appspot.com",
  messagingSenderId: "551429593644",
  appId: "1:551429593644:web:631702539d9c963bee0f89",
  measurementId: "G-P6XY23X83B"
};
// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const db = firebase.firestore(app);
export const svrfunctions = firebase.functions();
firebase.analytics();
