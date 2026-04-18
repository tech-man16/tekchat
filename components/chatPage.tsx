"use client";

import { chatContext } from "@/app/context/context";
import { useContext, useEffect, useState } from "react";
import { getConversation } from "@/app/(server)/actions";
import ChatBox from "./ChatBox";
import NotificationDrawer from "./notification";
import { ObjectId } from "mongodb";

// --- ICONS ---

export const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
    />
  </svg>
);

export const DeliveredIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    className="stroke-purple-300 size-3"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);

// --- STYLES ---

const styles = {
  received: {
    backgroundColor: "#2d213f",
    color: "#e9d5ff",
    padding: "10px 14px",
    borderRadius: "18px 18px 18px 2px",
    maxWidth: "75%",
    wordWrap: "break-word" as "break-word",
    border: "1px solid #44335a",
  },
  sent: {
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "18px 18px 2px 18px",
    maxWidth: "75%",
    wordWrap: "break-word" as "break-word",
    boxShadow: "0 4px 12px rgba(109, 40, 217, 0.2)",
  },
};

// --- SUB-COMPONENTS ---

export const SentBox = ({ msg }: { msg: string }) => {
  return (
    <div className="flex flex-col items-end mb-2 w-full">
      <div style={styles.sent} className="group transition-all">
        <p className="text-[15px] leading-relaxed">{msg}</p>
        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="opacity-80 text-[10px] text-purple-200">
            10:42 PM
          </span>
          <div className="flex -space-x-2">
            <DeliveredIcon />
            <DeliveredIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecieveBox = ({ msg }: { msg: string }) => {
  return (
    <div className="flex flex-col items-start mb-2 w-full">
      <div style={styles.received}>
        <p className="text-[15px] leading-relaxed">{msg}</p>
        <span className="block opacity-80 mt-1 text-[10px] text-purple-400">
          10:42 PM
        </span>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function ChatPage() {
  const { key }: any = useContext(chatContext);
  const [msg, setMsg]: any = useState([]);
  const user = key?.b || "Chat Page";

  useEffect(() => {
    const fetchConversation = async () => {
      if (key?.b != null) {
        try {
          const res = await getConversation({ userA: key.a, userB: key.b });
          setMsg(res.data);
        } catch (err) {
          console.error("Error fetching conversation:", err);
        }
      }
    };

    void fetchConversation();
  }, [key?.a, key?.b]);

  return (
    <div className="flex flex-col bg-[#0f0a19] shadow-2xl border border-[#2d213f] rounded-xl w-full h-[calc(100vh-2rem)] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#150f24]/80 backdrop-blur-md px-6 py-4 border-[#2d213f] border-b">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-gradient-to-tr from-[#7c3aed] to-[#d8b4fe] shadow-lg rounded-full w-10 h-10 font-bold text-white">
            {typeof user === "string" ? user.toUpperCase() : "U"}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight">{user}</span>
            <span className="flex items-center gap-1 text-[10px] text-green-400">
              <span className="bg-green-400 rounded-full w-1.5 h-1.5 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
        <NotificationDrawer
          data={{
            userA: { ID: key?.loginUser?._id, name: key?.loginUser?.userId },
          }}
        />
      </div>

      {/* Chat Messages Area */}
      <div className="flex flex-col flex-1 gap-3 bg-[#0f0a19] p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2d213f]">
        {msg.length === 0 ? (
          <div className="flex flex-col justify-center items-center space-y-4 h-full">
            <div className="bg-[#1a1425] p-4 rounded-full text-purple-500">
              <SendIcon />
            </div>
            <p className="font-medium text-gray-500 text-lg">
              No messages yet.
            </p>
            <p className="text-gray-600 text-sm italic">
              Wave hello to {user}!
            </p>
          </div>
        ) : (
          msg.map((message: any, index: number) => {
            const isSent = message.sent === key.a;
            return isSent ? (
              <SentBox key={index} msg={message.msg} />
            ) : (
              <RecieveBox key={index} msg={message.msg} />
            );
          })
        )}
      </div>

      {/* Input Footer */}
      <div className="bg-[#150f24] p-4 border-[#2d213f] border-t">
        <ChatBox messages={msg} setMessages={setMsg} />
      </div>
    </div>
  );
}
