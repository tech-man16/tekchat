"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";
// import {Label} from '@heroui/react';
// import { connect, disconnect } from '../db/connection';
import { getUser, insertUSER } from "../(server)/actions";
import { chatContext } from "../context/context";

export default function LoginPage() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const { key, setKey } = useContext(chatContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userData = await getUser({ userId: username, password: password });
      if (userData.status === 200) {
        setKey((prev: any) => ({
          ...prev,
          login: true,
          loginUser: userData.data,
        }));
        router.push("/" + username + "/home");
      } else {
        // If user not found, create a new user
        const newUser = await insertUSER({
          userId: username,
          password: password,
        });
        if (newUser.status === 200) {
          router.push("/" + username + "/home");
          setKey((prev: any) => ({ ...prev, login: true }));
        } else {
          console.error("User creation failed:", newUser.msg);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-800 h-screen">
      <div className="bg-black shadow-md p-8 rounded w-96">
        <span className="flex justify-center items-center mb-6 font-bold text-2xl text-center">
          Login
        </span>

        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full"
          label="Username"
          labelPlacement="outside-top"
        />
        <Input
          type="password"
          placeholder="Enter your password"
          className="mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          labelPlacement="outside-top"
        />
        <Button
          color={!isLoading ? "primary" : "default"}
          onPress={handleLogin}
          className="w-full"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
