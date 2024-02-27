"use client";
import {
  auth,
  chatsCollectionRef,
  db,
} from "@/firebase.config";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  MouseEvent,
  MouseEventHandler,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import * as EmailValidator from "email-validator";
interface SearchBoxProps {
  setSearchInput: React.Dispatch<
    React.SetStateAction<string>
  >;
}

function SearchBox({ setSearchInput }: SearchBoxProps) {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useAuthState(auth);
  const userChatsRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user?.email)
  );
  const [chatsSnapshot] = useCollection(userChatsRef);

  const createChat = async (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!input) return;

    if (
      EmailValidator.validate(input) &&
      input !== user?.email &&
      !chatAlreadyExists(input)
    ) {
      setLoading(true);
      await addDoc(collection(db, "chats"), {
        users: [user?.email, input],
      });
    }
    setLoading(false);
    setInput("");
    setSearchInput("");
  };
  const chatAlreadyExists = (recipientEmail: string) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat
          .data()
          .users.find(
            (user: string) => user == recipientEmail
          )?.length > 0
    );

  return (
    <div className="w-full md:px-5 px-3 mt-2 flex items-center space-x-2">
      <form className="bg-gray-800 rounded-md flex items-center space-x-3 w-full text-gray-400 px-4 flex-1">
        <MagnifyingGlassIcon className="h-5 w-5 " />
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSearchInput(e.target.value); // Update parent's search input
          }}
          className="w-full p-2 bg-transparent text-sm outline-none border-none"
          placeholder="Search or start new chat"
        />
      </form>
      {EmailValidator.validate(input) && (
        <button
          className="p-2 duration-200 transition ease-in-outhover:bg-gray-300 cursor-pointer hover:scale-105 border-none outline-none rounded-md bg-gray-200 text-sm text-gray-800 tracking-wide font-semibold h-full capitalize"
          onClick={createChat}
        >
          {loading ? (
            <div
              className="animate-spin inline-block w-3 h-3 border-[3px] border-current border-t-transparent rounded-full "
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            " Add +"
          )}
        </button>
      )}
    </div>
  );
}

export default SearchBox;
