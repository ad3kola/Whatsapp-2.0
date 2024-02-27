"use client";
import {
  MouseEvent,
  useEffect,
  useState,
  useRef,
  SetStateAction,
} from "react";
import { chatLinks } from "@/utils/data";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  orderBy,
  where,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase.config";
import { getRecipientData } from "@/utils/getRecipientData";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollection,
  useDocument,
} from "react-firebase-hooks/firestore";
import {
  PaperClipIcon,
  PhotoIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/24/solid";
import {
  FaceSmileIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Messages from "./Messages";
import moment from "moment";
import { useDispatch } from "react-redux";
import { OpenSidebar } from "@/redux/features/SidebarSlice";
function Header({ chatID }: { chatID: string }) {
  const currentChatRef = doc(db, "chats", chatID);
  const [user] = useAuthState(auth);
  const [recEmail, setRecEmail] = useState<string>("");
  const [recPhoto, setRecPhoto] = useState<string>("");
  const [recTimestamp, setRecTimestamp] =
    useState<string>("");
  const [currentUsers, setcurrentUsers] = useState<
    string[]
  >([]);
  const dispatch=useDispatch<AppDispatch>()
  useEffect(() => {
    const fetch = async () => {
      const chatDocSnapshot = await getDoc(currentChatRef);
      const currentChatUsers =
        chatDocSnapshot?.data()?.users;
      setcurrentUsers(currentChatUsers);
      const recipientEmail = getRecipientData(
        currentChatUsers,
        user!
      );
      setRecEmail(recipientEmail);
      const q = query(
        collection(db, "users"),
        where(
          "email",
          "==",
          getRecipientData(currentChatUsers, user!)
        )
      );
      const recipientSnapshot = await getDocs(q);
      const recipientPhoto =
        recipientSnapshot?.docs?.[0]?.data()?.photoURL;
      setRecPhoto(recipientPhoto);
      const recipientLastSeen =
        recipientSnapshot?.docs?.[0]?.data()?.lastSeen;
        if (recipientLastSeen) {
      const date = moment(recipientLastSeen?.toDate());
      const lastSeenTimestamp = moment(date)?.format("lll");
          setRecTimestamp(`Last active: ${lastSeenTimestamp}`);
          // Feb 26, 2024 10:57 PM
        } else {
          setRecTimestamp('Unavailable - user not online'); 
        }

    };
    fetch();
  }, [chatID]);
  return (
    <nav className="sticky top-0 left-0 right-0 w-full flex items-center justify-between px-3 bg-gray-800 h-16 py-2 z-30">
      <div className="flex flex-1 items-center space-x-2 w-full">
        {recPhoto ? (
          <Image
            src={recPhoto!}
            alt="user-img"
            width={35}
            height={35}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 bg-gradient-to-br from-[#3f5efb] to-[#fc466b] rounded-full cursor-pointer flex items-center justify-center ">
            <p className="uppercase font-bold text-lg text-white">
              {recEmail[0]}
            </p>
          </div>
        )}
        <div className="flex flex-col justify-center h-full">
          <p className="text-gray-200 tracking-wider text-sm font-medium">
            {recEmail}
          </p>
          <p className="text-[10px] text-gray-400 tracking-wider font-medium">
         {recTimestamp}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2 md:space-x-7 md:mr-2">
        {chatLinks.map(({ Icon }, id) => (
          <Icon
            key={id}
            className={`hidden md:inline-flex w-5 h-5 md:w-6 md:h-6 text-gray-300 flex-shrink-0 cursor-pointer duration-100 hover:scale-105 ease-in-out transition relative`}
          />
        ))}
        <button onClick={() => dispatch(OpenSidebar())}  className ='inline-flex md:hidden border-none outline-none rounded-full p-2 hover:bg-gray-600'>
        <EllipsisVerticalIcon
            className={`w-5 h-5 md:w-6 md:h-6 text-gray-300 flex-shrink-0 cursor-pointer duration-100 hover:scale-105 ease-in-out transition relative`}
          /></button>
      </div>
    </nav>
  );
}
function InputBox() {
  const [user] = useAuthState(auth);
  const currentChatID = useAppSelector(
    (state) => state.IDSlice.value.id
  );
  const [inputMessage, setInputMessage] =
    useState<string>("");
  const sendMessage = async (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!inputMessage) return;
    try {
      await setDoc(
        doc(db, "users", user?.uid!),
        {
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err);
    }

    try {
      await addDoc(
        collection(db, "chats", currentChatID, "Messages"),
        {
          timestamp: serverTimestamp(),
          message: inputMessage,
          user: user?.email,
          photoURL: user?.photoURL,
          lastSeen: serverTimestamp(),
        }
      );
      setInputMessage("");
    } catch (err) {
      console.log(err);
      alert("Error sending message");
    }
  };

  return (
    <form className="border-t border-gray-800 sticky z-20 bottom-0 left-0 right-0 w-full flex items-center space-x-3 py-1 h-12 px-4">
      <FaceSmileIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-300" />
      <input
        value={inputMessage}
        placeholder="Write a message..."
        onChange={(e) => setInputMessage(e.target.value)}
        className="w-full bg-transparent  text-gray-200 px-2 tracking-wide outline-none  font-normal placeholder:text-sky-600"
      />
      <PaperClipIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-300 -rotate-12" />
      <PhotoIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-300" />
      <button
        onClick={sendMessage}
        className="p-1.5 rounded-full bg-sky-500 flex items-center justify-center border-none outline-none cursor-pointer hover:scale-105 duration-100 transform transition disabled:bg-sky-700"
        disabled={!inputMessage}
      >
        <PaperAirplaneIcon className="h-6 w-6 text-gray-300" />
      </button>
    </form>
  );
}
function ChatsSection() {
  const currentChatID = useAppSelector(
    (state) => state.IDSlice.value.id
  );
    const dispatch=useDispatch<AppDispatch>()

  return (
    <aside className="flex-1 w-full bg-slate-900 overflow-hidden">
      {currentChatID ? (
        <div className="relative w-full h-screen flex flex-col">
          <Header chatID={currentChatID} />
          <Messages chatID={currentChatID} />
          <InputBox />
        </div>
      ) : (
          
          <div className="flex relative flex-col items-center justify-center max-w-4xl h-full text-center w-full mx-auto -pt-40">
            <button className='md:hidden rounded-full px-5 py-2 text-gray-200 bg-gray-600 -mt-4 border-none outline-none active:scale-90 duration-100 ease-in-out transform ' onClick={() => dispatch(OpenSidebar())}>Open Chats</button>
            <Image src={'/assets/whatsapp-call-pc-image.png'} alt={'whatsapp-on-pc'} width={200} height={250} />
          <h2 className="text-2xl font-bold tracking-[3px] text-sky-500 uppercase mt-4 md:mt-0">
            Whatsapp 2.0
          </h2>
          <h2 className="text-xl font-semibold tracking-wider text-gray-200">
            Chat with all of your family and friends,
            anytime, anywhere.
          </h2>
          <h3 className="font-serif text-lg text-sky-500 tracking-wide">
            To create a chat, add through the search bar.
          </h3>
          <h4 className="bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 bg-clip-text text-transparent absolute bottom-5 left-1/2 -translate-x-1/2 font-bold text-xl animate-pulse">
            Adekola Adedeji
          </h4>
        </div>
      )}
    </aside>
  );
}

export default ChatsSection;
