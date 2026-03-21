"use client";
import React, { createContext, useState } from "react";

export type ChatContextType = {
  key: Record<string, any> | null;
  setKey: React.Dispatch<React.SetStateAction<Record<string, any> | null>>;
};

export const chatContext = createContext<ChatContextType>({
  key: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setKey: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState<Record<string, any> | null>(null);
  return <chatContext.Provider value={{ key, setKey }}>{children}</chatContext.Provider>;
}