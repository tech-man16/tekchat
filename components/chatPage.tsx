"use client";

import { chatContext } from "@/app/context/context";
import { useContext, useEffect, useState } from "react";
import { getConversation } from "@/app/(server)/actions";
import { storeChat } from "@/app/(server)/actions";
import ChatBox from "./ChatBox";

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

export const deliveredIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    className="stroke-green-400 size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);

export const AddIcon = (props: any) => (
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
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);
const styles = {
  recieved: {
    backgroundColor: "#E5E5EA",
    color: "black",
    padding: "10px 15px",
    borderRadius: "15px",
    maxWidth: "30%",
    marginBottom: "10px",
    wordWrap: "break-word" as "break-word",
  },
  sent: {
    backgroundColor: "#E5E5E2",
    color: "black",
    padding: "10px 15px",
    borderRadius: "15px",
    marginBottom: "10px",
    maxWidth: "30%",
    wordWrap: "break-word" as "break-word",
  },
};

export const SentBox = ({ msg }: { msg: string }) => {
  return (
    <div className="relative flex justify-end items-end">
      <span style={styles.sent}>{msg}</span>
      <span className="right-0 bottom-2 absolute ml-1">
        {deliveredIcon({ fill: "green" })}
      </span>
      <span className="right-1 bottom-2 absolute ml-1">
        {deliveredIcon({ fill: "green" })}
      </span>
    </div>
  );
};

export const RecieveBox = ({ msg }: { msg: string }) => {
  return (
    <div className="relative flex justify-start items-end">
      <span style={styles.recieved}>{msg}</span>
    </div>
  );
};

export default function ChatPage() {
  const { key }: any = useContext(chatContext);
  const [msg, setMsg]: any = useState([]);

  const [sentMsg, setSentMsg] = useState("");

  const user = key?.b || "Chat Page";
  useEffect(() => {
    const fetchConversation = async () => {
      if (key?.b != null) {
        try {
          const res = await getConversation({ userA: key.a, userB: key.b });
          if (res.status === 200) {
            console.log("Conversation data:", res.data);
            setMsg(res.data);
          } else {
            console.error("Failed to fetch conversation:", res.msg);
          }
        } catch (err) {
          console.error("Error fetching conversation:", err);
        }
      }
    };

    void fetchConversation();
  }, [key?.a, key?.b]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return; // Don't send empty messages
    try {
      const res = await storeChat({ userA: key.a, userB: key.b, msg: message });
      setMsg((prev: any) => [...prev, { sent: key.a, msg: message }]);
      if (res.status === 200) {
        console.log("Message stored successfully:", res.data);
      } else {
        console.error("Failed to store message:", res.msg);
      }
    } catch (err) {
      console.error("Error storing message:", err);
    } finally {
      setSentMsg("");
    }
  };

  return (
    <div className="flex flex-col flex-2/3 gap-2 p-4 border rounded-lg">
      <span className="p-3 font-semibold text-2xl">{user}</span>
      <div className="flex flex-col flex-2/3 gap-2 p-4 border rounded-lg overflow-y-auto">
        {msg.length === 0 ? (
          <div className="flex justify-center items-center h-full font-bold text-gray-500 text-xl">
            No messages yet. Start the conversation!
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
      {/* send message (realtime via Ably) */}
      <ChatBox messages={msg} setMessages={setMsg} />
    </div>
  );
}
