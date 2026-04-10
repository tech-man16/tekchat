"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Ably from "ably";
import { chatContext } from "@/app/context/context";
import { storeChat } from "@/app/(server)/actions";

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
    const channelName = `private-chat:${ids[0]}:${ids[1]}`;

    // Create an Ably Realtime client that will request tokens from our server route
    // The server route is at /ably/token and already supports the required params
    // @ts-ignore
    const ably = new Ably.Realtime({
      authUrl: `/ably/token?userA=${encodeURIComponent(key.a)}&userB=${encodeURIComponent(key.b)}&clientId=${encodeURIComponent(key.a)}`,
      clientId: key.a,
    });

    const channel = ably.channels.get(channelName);
    channel.subscribe((msg: any) => {
      try {
        const data = msg.data;
        // normalize message object shape
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
          // avoid duplicates
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
      } catch (e) {
        // ignore
      }
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

    const payload = {
      msg: text,
      sent: key.a,
      received: key.b,
      timestamp: new Date(),
    };

    try {
      // Publish via Ably for realtime delivery
      if (channel) {
        channel.publish("message", payload);
      }

      // Persist in MongoDB via existing storeChat action
      const res = await storeChat({ userA: key.a, userB: key.b, msg: text });
      if (res?.status === 200 || res?.status === 201) {
        // append locally
        setMessages((prev) => [
          ...prev,
          { sent: key.a, msg: text, timestamp: new Date() },
        ]);
      } else {
        console.error("storeChat failed", res);
      }
    } catch (e) {
      console.error("Error sending message:", e);
    } finally {
      setText("");
    }
  };

  return (
    <div className="flex gap-4">
      <Input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e: any) => setText(e.target.value)}
      />
      <Button onPress={handleSend}>Send</Button>
    </div>
  );
}
