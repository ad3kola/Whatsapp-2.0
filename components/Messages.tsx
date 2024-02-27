"use client";
import { useRef, useEffect } from "react";
import { db, auth } from "@/firebase.config";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";
import { CheckIcon } from '@heroicons/react/24/solid'

interface MessagesProps {
  chatID: string;
}

function Messages({ chatID }: MessagesProps) {
  const [user] = useAuthState(auth);
  const messagesRef = collection(
    db,
    "chats",
    chatID,
    "Messages"
  );
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  const [chatMessagesSnapshot] = useCollection(q);
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null)
  useEffect(() => {

    const scrollDown = () => {
      endOfMessagesRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    scrollDown()
  }, [chatMessagesSnapshot])

  return (
    <div className="h-full overflow-y-scroll scrollbar-hide w-full space-y-2 p-4">
      {chatMessagesSnapshot?.docs.map((doc) => {
        const data = doc.data();
        const isSender = user?.email === data?.user;
        return (
          <div
            key={doc.id}
            className={`message ${
              isSender ? "sender" : "receiver"
            } w-full`}
          >
            {data?.message}

            <span className="w-full flex item-center justify-end absolute bottom-0.5 right-2 text-right text-[10px]">
              {moment(data?.timestamp?.toDate())?.format("LT")} 
            </span>
          </div>
        );
      })}
      <div ref ={endOfMessagesRef}></div>
    </div>
  );
}

export default Messages;
