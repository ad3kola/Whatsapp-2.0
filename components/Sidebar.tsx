"use client";
import { MouseEventHandler, useState } from "react";
import { navLinks } from "@/utils/data";
import SearchBox from "@/components/SearchBox";
import Chat from "@/components/Chat";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase.config";
import {
  query,
  orderBy,
  collection,
  where,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { updateChatID } from "@/redux/features/IDSlice";
import { CloseSidebar } from "@/redux/features/SidebarSlice";
import { Combobox } from '@headlessui/react'

function Header() {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch<AppDispatch>()
  return (
    <nav className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 h-14 rounded-md z-50">
      {user?.photoURL ? (
        <Image
          src={user?.photoURL!}
          alt="user-img"
          width={40}
          height={40}
          onClick={() => signOut(auth)}
          className="rounded-full object-cover cursor-pointer hover:brightness-110 duration-100 ease-in-out transition transform"
        />
      ) : (
        <div
          className="w-11 h-11 bg-gray-400 rounded-full cursor-pointer flex items-center justify-center"
          onClick={() => signOut(auth)}
        >
          <UserIcon className="w-6 h-6 text-gray-500" />
        </div>
      )}
      <div className="flex items-center justify-center space-x-3">
        {navLinks.map(({ Icon }, id) => (
          <div key={id} className="flex-shrink-0 cursor-pointer duration-100 hover:scale-105 ease-in-out transition relative">
            <Icon
              key={id}
              className="w-6 z-10 h-6 text-gray-300"
            />
            <span className="absolute bg-sky-500 h-1.5 w-1.5 rounded-full top-0.5 right-0.5 z-20"></span>{" "}
          </div>
        ))}
        <button onClick={() => dispatch(CloseSidebar())}  className ='inline-flex md:hidden border-none outline-none rounded-full p-2 hover:bg-gray-600'>
        <XMarkIcon
            className={`w-5 h-5 md:w-6 md:h-6 text-gray-300 flex-shrink-0 cursor-pointer duration-100 hover:scale-105 ease-in-out transition relative`}
          /></button>
      </div>
    </nav>
  );
}

function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const [user] = useAuthState(auth);
  const userChatsRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user?.email));

  const [chatsSnapshot] = useCollection(userChatsRef);
  const sidebarState = useAppSelector(state => state.SidebarSlice.value.openSidebar)
  const makeChatActive = (id: string) => {
    dispatch(updateChatID(id))
    dispatch(CloseSidebar())
  }

  const [searchInput, setSearchInput] = useState<string>('');

  // Filter Chats based on Search Input
  const filteredChats = chatsSnapshot?.docs?.filter((doc) =>
    doc.data().users.some((user: string) =>
      user.toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  // Render Filtered Chats
  const renderChats = filteredChats?.map((doc) => (
    <Chat
      onClick={() => makeChatActive(doc.id)}
      key={doc.id}
      id={doc.id}
      users={doc.data().users}
    />
  ));

  return (
    <>
      {/* Always-On-Display Sidebar */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 max-h-screen border-r pb-5 px-1 border-gray-600 bg-slate-900 z-30 overflow-hidden`}>
        <Header />
        <SearchBox setSearchInput={setSearchInput} />
        <div className="pb-8 mt-3 flex flex-col w-full overflow-y-scroll scrollbar-hide scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-sky-500 scrollbar-track-transparent h-full pr-2">
          {renderChats}
        </div>
      </aside>

      {/* Modal Sidebar */}
      <aside className={`${sidebarState ? 'left-0' : '-left-full'} md:hidden absolute top-0 bottom-0 duration-1000 transition ease-in-out w-full flex flex-col flex-shrink-0 max-h-screen pb-5 border-gray-600 bg-slate-900 z-30 overflow-hidden`}>
        <Header />
        <SearchBox setSearchInput={setSearchInput} />
        <div className="pb-3 mt-3 flex flex-col w-full overflow-y-scroll scrollbar-hide scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-sky-500 scrollbar-track-transparent h-full pr-2">
          {renderChats}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;