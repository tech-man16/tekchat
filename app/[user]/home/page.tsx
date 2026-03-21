"use client";
import ChatPage from "@/components/chatPage";
import Chatlist from "@/components/chatList";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { chatContext } from "@/app/context/context";

export default function Home() {
  const path = usePathname();
  const user = path.split("/")[1];
  const { key, setKey }: any = useContext(chatContext);
  useEffect(() => {
    if (key == null) return;
    if (key.a !== user) setKey((prev: any) => ({ ...prev, a: user }));
  }, [key]);

  if (key == null) {
    return (
      <div className="flex justify-center items-center h-screen font-bold text-2xl">
        Please login to access the chat
      </div>
    );
  }

  if (!key.login)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-2xl">
        Please login to access the chat
      </div>
    );
  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-full">
        <Chatlist />
        <ChatPage />
      </div>
    </div>
  );
}
