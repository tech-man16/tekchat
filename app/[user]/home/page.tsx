"use client";
import ChatPage from "@/components/chatPage";
import Chatlist from "@/components/chatList";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { chatContext } from "@/app/context/context";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const path = usePathname();
  const user = path.split("/")[1];
  const { key, setKey }: any = useContext(chatContext);

  useEffect(() => {
    if (key?.login && key.a !== user) {
      setKey((prev: any) => ({ ...prev, a: user }));
    }
  }, [user, key?.a, key?.login, setKey]);

  if (!key?.login) return null;

  return (
    <div className="flex bg-[#0f0a19] h-screen overflow-hidden">
      {/* --- MOBILE VIEW: Swapping with Motion --- */}
      <div className="md:hidden flex w-full h-full">
        <AnimatePresence mode="wait">
          {!key.b ? (
            <motion.div
              key="list-mobile"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <Chatlist />
            </motion.div>
          ) : (
            <motion.div
              key="chat-mobile"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <ChatPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- DESKTOP VIEW: Static Side-by-Side (No Swapping) --- */}
      <div className="hidden md:flex w-full h-full">
        <div className="border-[#2d213f] border-r w-1/3">
          <Chatlist />
        </div>
        <div className="flex-1">
          <ChatPage />
        </div>
      </div>
    </div>
  );
}