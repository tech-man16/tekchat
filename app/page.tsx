"use client";
import ChatPage from "@/components/chatPage";
import Chatlist from "@/components/chatList";
import { useState } from "react";
import { chatContext } from "./context/context";
export default function Home() {
  const [key, setKey] = useState<Record<string, any> | null>(null);
  return (
    <chatContext.Provider value={{ key, setKey }}>
      <div className="flex h-screen">
        <Chatlist />
        <ChatPage />
      </div>
    </chatContext.Provider>
  );
}
