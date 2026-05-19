"use client";

import { chatContext } from "@/app/context/context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { LogOutIcon } from "lucide-react";
import SearchFriend from "./friendsearch";

export const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </svg>
);

const Chatlist = () => {
  const { key, setKey } = useContext(chatContext);
  const router = useRouter();

  // Initialized as array to prevent .length errors
  const [friendList, setFriendList]: any = useState([]);

  useEffect(() => {
    if (key?.login) {
      const statuses = key.loginUser.status || {};
      const filteredData: any = Object.entries(statuses)
        .filter(([key, value]: any) => value.includes("accepted"))
        .map(([key, value]) => ({
          id: key,
          details: value,
        }));
      setFriendList(filteredData);
    } else {
      console.log("User not logged in, skipping notification fetch.");
    }
  }, [key]);

  const handleLogout = () => {
    setKey((prev: any) => ({ ...(prev || {}), login: false, loginUser: null }));
    router.push("/login");
  };

  return (
    <div className="flex flex-col bg-[#0f0a19] w-full h-full text-[#e9d5ff]">
      {/* Header Area */}
      <div className="flex justify-between items-center bg-[#150f24] p-2 border-[#2d213f] border-b">
        <span className="p-4 font-bold text-white text-2xl tracking-tight">Chats</span>
        <div className="flex items-center gap-2">
          <SearchFriend />
          <Button
            isIconOnly
            onPress={handleLogout}
            aria-label="Logout"
            className="bg-white/5 hover:bg-danger/10 rounded-full w-10 min-w-0 h-10 text-gray-400 hover:text-danger transition-all"
          >
            <LogOutIcon />
          </Button>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2d213f]">
        {friendList.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-6 h-full font-semibold text-gray-500 text-xl text-center">
            <div className="opacity-20 mb-4">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            No friends found.<br/> 
            <span className="font-normal text-gray-600 text-sm">Start a new chat!</span>
          </div>
        ) : (
          friendList &&
          Object.values(friendList).map((friend: any) => (
            <div
              key={friend.id}
              className={`flex justify-between items-center gap-2 border-b border-[#1a1425] transition-colors duration-200 ${
                key?.b === friend.details[0] ? "bg-[#2d213f]" : "hover:bg-[#150f24]"
              }`}
            >
              <div 
                className="flex flex-1 items-center gap-4 p-5 cursor-pointer"
                onClick={() =>
                  setKey((prev: any) => ({
                    ...prev,
                    b: friend.details[0],
                  }))
                }
              >
                {/* Initial Avatar circle */}
                <div className="flex justify-center items-center bg-gradient-to-tr from-[#7c3aed] to-[#6d28d9] shadow-md rounded-full w-10 h-10 font-bold text-white">
                  {friend.details[0].toUpperCase()}
                </div>
                
                <span className="font-medium text-[16px]">
                  {friend.details[0]}
                </span>
              </div>

              <div className="pr-4">
                <Button
                  isIconOnly
                  onPress={() =>
                    setKey((prev: any) => ({
                      ...prev,
                      b: friend.details[0],
                    }))
                  }
                  className="bg-[#1a1425] hover:bg-[#7c3aed] rounded-full w-10 min-w-0 h-10 text-purple-400 hover:text-white transition-all"
                >
                  <ArrowRightIcon />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chatlist;
// export default Chatlist;
