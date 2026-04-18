"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
// We use Lucide icons for a clean, modern vector look.
// You'll need to install them: npm install lucide-react
// import { LockIcon, UserIcon, MailWarningIcon, LogInIcon } from "lucide-react";
import { getUser, insertUSER } from "../(server)/actions";
import { chatContext } from "../context/context";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setKey } = useContext(chatContext);

  const handleLogin = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // 1. Attempt Login
      const userData = await getUser({ userId: username, password: password });

      if (userData.status === 200) {
        // Success: Update context FIRST, then redirect
        setKey((prev: any) => ({
          ...prev,
          login: true,
          loginUser: userData.data,
        }));
        router.push(`/${username}/home`);
      } else if (userData.status === 404) {
        // 2. User not found -> Attempt Auto-Registration
        console.log("User not found, attempting registration...");
        const newUser = await insertUSER({
          userId: username,
          password: password,
        });

        if (newUser.status === 200) {
          // Registration Success: Set login state, then redirect
          setKey((prev: any) => ({
            ...prev,
            login: true,
            loginUser: newUser.data,
          }));
          router.push(`/${username}/home`);
        } else {
          // Registration Failed (e.g., weak password, connection issue)
          setError(
            newUser.msg ||
              "Registration failed. Please try a different username.",
          );
        }
      } else {
        // 3. User found, but password or other status is wrong
        setError(
          "Invalid credentials. Please check your username and password.",
        );
      }
    } catch (err) {
      console.error("Critical Login Error:", err);
      setError("An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // MAIN CONTAINER: Dark, modern background with subtle subtle radial glow.
    <div className="relative flex flex-col justify-center items-center bg-[#0a0c10] w-screen h-screen overflow-hidden text-gray-100">
      <div className="-top-40 -left-40 absolute bg-primary-500 opacity-10 blur-[128px] rounded-full w-96 h-96 pointer-events-none" />
      <div className="-right-40 -bottom-40 absolute bg-purple-600 opacity-10 blur-[128px] rounded-full w-96 h-96 pointer-events-none" />

      {/* LOGIN CARD */}
      <Card className="z-10 bg-black/60 shadow-2xl shadow-primary-900/10 backdrop-blur-xl p-4 border border-gray-800 rounded-3xl w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-2 pb-6">
          {/* Company Brand Logo/Icon Area */}
          <div className="flex justify-center items-center bg-primary/10 mb-2 rounded-full w-16 h-16 text-primary">
            {/* <LogInIcon size={32} strokeWidth={1.5} /> */}
          </div>
          <h1 className="font-bold text-4xl tracking-tighter">
            <span className="text-white">tek</span>
            <span className="text-primary">Chat</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Welcome back! Sign in to continue.
          </p>
        </CardHeader>

        <Divider className="bg-gray-800" />

        <CardBody className="gap-5 pt-8">
          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-3 bg-danger-500/10 p-3 border border-danger-500/20 rounded-xl text-danger-300 text-sm">
              {/* <MailWarningIcon className="flex-shrink-0 w-5 h-5" /> */}
              <p>{error}</p>
            </div>
          )}

          <Input
            type="text"
            variant="bordered"
            label="Username or Email"
            labelPlacement="outside"
            placeholder="developer@tekchat.io"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isDisabled={isLoading}
            // Aesthetic updates: Add icons and custom styling classes
            // startContent={<UserIcon className="text-gray-500" size={18} />}
            classNames={{
              label: "text-gray-300 font-medium",
              inputWrapper:
                "border-gray-700 hover:border-primary focus-within:!border-primary bg-gray-900/50 rounded-xl h-12",
              input: "text-base text-white placeholder:text-gray-600",
            }}
          />

          <Input
            type="password"
            variant="bordered"
            label="Password"
            labelPlacement="outside"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isLoading}
            // startContent={<LockIcon className="text-gray-500" size={18} />}
            classNames={{
              label: "text-gray-300 font-medium",
              inputWrapper:
                "border-gray-700 hover:border-primary focus-within:!border-primary bg-gray-900/50 rounded-xl h-12",
              input: "text-base text-white placeholder:text-gray-600",
            }}
          />

          <Button
            size="lg"
            color="primary"
            onPress={handleLogin}
            isLoading={isLoading}
            // Use 'spinner' prop for better visual feedback
            spinner={
              <svg
                className="w-5 h-5 text-current animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            }
            className="bg-primary hover:bg-primary-600 shadow-lg shadow-primary/20 mt-3 rounded-xl w-full font-semibold text-white"
          >
            {isLoading ? "Authenticating..." : "Sign In to tekChat"}
          </Button>

          <div className="mt-2 text-gray-600 text-xs text-center">
            By signing in, you agree to our Terms of Service.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
