import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import {collection, getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCmv4q2VpGkTqnYhziqcbOrtyi3SVi3C30",
  authDomain: "twitter-clone-build-9558e.firebaseapp.com",
  projectId: "twitter-clone-build-9558e",
  storageBucket: "twitter-clone-build-9558e.appspot.com",
  messagingSenderId: "303430174006",
  appId: "1:303430174006:web:4c3f9d63da6dee73d51f97"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)

export const chatsCollectionRef = collection(db, 'chats')