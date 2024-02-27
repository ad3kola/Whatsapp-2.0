import { auth, db } from "@/firebase.config";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { UserIcon } from "@heroicons/react/24/solid";
import {
  query,
  doc,
  getDocs,
  collection,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { MouseEventHandler } from "react";
import { useAppSelector } from "@/redux/store";
import { getRecipientData } from "@/utils/getRecipientData";

interface Props {
  id: string;
  users: string[];
  onClick: MouseEventHandler<HTMLDivElement>;
}

function Chat({ id, users, onClick }: Props) {
  const currentChatID = useAppSelector(
    (state) => state.IDSlice.value.id
  );
  const [user] = useAuthState(auth);
  const q = query(
    collection(db, "users"),
    where("email", "==", getRecipientData(users, user!))
  );
  const [recipientSnapshot] = useCollection(q);
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientData(users, user!);
  return (
    <div
      onClick={onClick}
      className={`w-full p-3 space-x-3 flex items-center ${
        currentChatID == id
          ? "bg-slate-800"
          : "hover:bg-slate-800"
      } duration-100 ease-in-out transition cursor-pointer`}  
    >
      {recipient?.photoURL ? (
        <Image
          src={recipient?.photoURL!}
          alt="user-img"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-11 h-11 flex-shrink-0 bg-gradient-to-br from-[#3f5efb] to-[#fc466b] rounded-full cursor-pointer flex items-center justify-center ">
          <p className="uppercase font-bold text-lg text-white">
            {recipientEmail[0]}
          </p>
        </div>
      )}
      <p className="text-gray-300 text-sm tracking-wider break-words">
        {recipientEmail}
      </p>
    </div>
  );
}

export default Chat;
