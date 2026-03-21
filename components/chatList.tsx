"use client";

import { chatContext } from "@/app/context/context";
import { useContext, useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { getFriends } from "@/app/(server)/actions";
import SearchFriend from "./friendsearch";

export const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
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

  // const li = [
  //   { id: 1, name: "B" },
  //   { id: 2, name: "Honda" },
  //   { id: 3, name: "Toyota" },
  // ];

  const [friendList, setFriendList]: any = useState({});

  useEffect(() => {
    if (!key?.login) return;
    let mounted = true;

    if (key.a == null) return;
    const fetchFriends = async () => {
      try {
        console.log("Fetching friends for user:", key);
        const res = await getFriends({ userId: key.a });
        if (res.status === 200 && mounted) {
          setFriendList(res.data[0] || []);
          console.log("Friend list updated:", res.data[0] || []);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    void fetchFriends();

    return () => {
      mounted = false;
    };
  }, [key?.a]);

  return (
    <div className="flex flex-col flex-1/3 border">
      <div className="flex justify-between items-center border-b">
        <span className="p-4 border-b font-semibold text-2xl">Chats</span>
        <SearchFriend />
      </div>
      {friendList.length === 0 ? (
        <div className="flex justify-center items-center h-full font-bold text-xl">
          No friends found. Start a new chat!
        </div>
      ) : (
        friendList.f &&
        Object.keys(friendList.f).map((friend: any) => (
          <div
            key={friend}
            className="flex justify-between items-center gap-2 p-4 border-b"
          >
            <div className="flex-1 hover:bg-gray-700/80 p-4 cursor-pointer">
              {friend}
            </div>
            <Button
              onPress={() =>
                setKey((prev: any) => ({
                  ...prev,
                  b: friend,
                }))
              }
              className="hover:bg-purple-600/80 p-2 hover:cursor-pointer"
            >
              <ArrowRightIcon />
            </Button>
          </div>
        ))
      )}
      {/* {friendList.friends?.map((item: any) => (
        <div key={item.id} className="flex gap-2 p-4 border-b">
          <div className="flex-1 hover:bg-gray-700/80 p-4 cursor-pointer">
            {item.name}
          </div>
          <button
            onClick={() => setKey((prev: any) => ({ ...prev, b: item.name }))}
            className="hover:bg-amber-200 p-2 hover:text-black hover:cursor-pointer"
          >
            <ArrowRightIcon />
          </button>
        </div>
      ))} */}
    </div>
  );
};

export default Chatlist;
