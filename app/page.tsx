"use client";
import SignInPage from "@/components/SignInPage";
import MainPage from "@/components/MainPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase.config";
import { useEffect } from "react";
import { collection, doc, serverTimestamp, addDoc, setDoc } from "firebase/firestore";
import Loading from "@/components/Loading";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    const updateUserState = async () => {
      if (user) {
        await setDoc(doc(db, 'users', user?.uid), {
          email: user?.email,
          lastSeen: serverTimestamp(),
          photoURL: user?.photoURL,
        }, {merge: true});
      }
    };
    updateUserState();
  }, [user]);
  if (loading) return <Loading />
  if (!user) return <SignInPage />;
  return (
    <main className='overflow-hidden' >
      <MainPage />
    </main>
  );
}
