"use client";
import ChatPage from "@/components/chatPage";
import Chatlist from "@/components/chatList";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Chatlist />
      <ChatPage />
    </div>
  );
}
