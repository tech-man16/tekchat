"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Ably from "ably";
import { chatContext } from "@/app/context/context";
import { storeChat } from "@/app/(server)/actions";

// --- SEND ICON ---
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

type Props = {
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function ChatBox({ messages, setMessages }: Props) {
  const { key }: any = useContext(chatContext);
  const [text, setText] = useState("");
  const channelRef = useRef<any>(null);
  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (!key?.a || !key?.b) return;

    const ids = [key.a, key.b].sort();
    const channelName = `private-chat:${ids}:${ids}`;

    // @ts-ignore
    const ably = new Ably.Realtime({
      authUrl: `/ably/token?userA=${encodeURIComponent(key.a)}&userB=${encodeURIComponent(
        key.b,
      )}&clientId=${encodeURIComponent(key.a)}`,
      clientId: key.a,
    });

    const channel = ably.channels.get(channelName);
    channel.subscribe((msg: any) => {
      try {
        const data = msg.data;
        const incoming =
          typeof data === "object" &&
          data !== null &&
          (data.msg || data.message)
            ? {
                msg: data.msg ?? data.message,
                sent: data.sent ?? data.clientId,
                timestamp: data.timestamp ?? new Date(),
              }
            : {
                msg: String(data),
                sent: msg.clientId ?? key.b,
                timestamp: new Date(),
              };

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.msg === incoming.msg && last.sent === incoming.sent)
            return prev;
          return [...prev, incoming];
        });
      } catch (e) {
        console.error("Ably message parse error:", e);
      }
    });

    clientRef.current = ably;
    channelRef.current = channel;

    return () => {
      try {
        channel.unsubscribe();
      } catch (e) {}
      try {
        ably.close();
      } catch (e) {}
      channelRef.current = null;
      clientRef.current = null;
    };
  }, [key?.a, key?.b, setMessages]);

  const handleSend = async () => {
    if (!text.trim() || !key?.a || !key?.b) return;
    const channel = channelRef.current;
    const messageText = text;
    setText(""); // Clear immediately for UI responsiveness

    const payload = {
      msg: messageText,
      sent: key.a,
      received: key.b,
      timestamp: new Date(),
    };

    try {
      if (channel) {
        channel.publish("message", payload);
      }

      const res = await storeChat({
        userA: key.a,
        userB: key.b,
        msg: messageText,
      });
      if (res?.status === 200 || res?.status === 201) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.msg === messageText && last.sent === key.a)
            return prev;
          return [
            ...prev,
            { sent: key.a, msg: messageText, timestamp: new Date() },
          ];
        });
      }
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-[#150f24] shadow-lg p-2 border border-[#2d213f] rounded-2xl">
      <Input
        type="text"
        variant="flat"
        placeholder="Type a message..."
        value={text}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        onChange={(e: any) => setText(e.target.value)}
        classNames={{
          input: "text-white placeholder:text-gray-500",
          inputWrapper: [
            "bg-transparent",
            "hover:bg-transparent",
            "group-data-[focus=true]:bg-transparent",
            "shadow-none",
          ],
        }}
      />
      <Button
        isIconOnly
        radius="full"
        onPress={handleSend}
        className="bg-[#7c3aed] hover:bg-[#6d28d9] shadow-lg shadow-purple-900/20 text-white active:scale-95 transition-all"
      >
        <SendIcon />
      </Button>
    </div>
  );
}
