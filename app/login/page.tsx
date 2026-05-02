"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Progress,
} from "@heroui/react";
import { 
  LockIcon, 
  UserIcon, 
  MailWarningIcon, 
  LogInIcon, 
  UserPlusIcon, 
  EyeIcon, 
  EyeOffIcon, 
  ShieldCheckIcon,
  CheckCircle2Icon 
} from "lucide-react";
import { getUser, insertUSER } from "../(server)/actions";
import { chatContext } from "../context/context";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setKey } = useContext(chatContext);

  // --- ENHANCED SECURITY LOGIC ---
  // Criteria: Min 8 chars, at least 1 uppercase, 1 number, and 1 special character
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLengthValid = password.length >= 8;
  
  const isPasswordSecure = hasUpperCase && hasNumber && hasSpecial && isLengthValid;
  
  // Calculate strength percentage for the UI bar
  const strengthScore = [hasUpperCase, hasNumber, hasSpecial, isLengthValid].filter(Boolean).length;
  const strengthPercentage = (strengthScore / 4) * 100;
  
  const isUsernameValid = /^[a-zA-Z0-9_]{3,16}$/.test(username);
  const isConfirmValid = isSignUp ? (confirmPassword === password && password !== "") : true;

  const handleAuth = async () => {
    setError(null);
    
    // Strict enforcement for Signup
    if (isSignUp && !isPasswordSecure) {
      setError("Password must include uppercase, numbers, and symbols.");
      return;
    }

    setLoading(true);
    try {
      const payload = { userId: username.trim(), password };
      const response = isSignUp ? await insertUSER(payload) : await getUser(payload);

      if (response.status === 200) {
        setKey((prev: any) => ({ ...prev, login: true, loginUser: response.data }));
        router.push(`/${username}/home`);
      } else {
        setError(response.msg || "Authentication failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center bg-[#0a0c10] w-screen h-screen overflow-hidden text-gray-100">
      <div className="-top-40 -left-40 absolute bg-primary-500 opacity-10 blur-[128px] rounded-full w-96 h-96 pointer-events-none" />
      <div className="-right-40 -bottom-40 absolute bg-purple-600 opacity-10 blur-[128px] rounded-full w-96 h-96 pointer-events-none" />

      <Card className="z-10 bg-black/40 shadow-2xl backdrop-blur-2xl p-2 border border-white/10 rounded-3xl w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-6 text-center">
          <div className="flex justify-center items-center bg-primary/20 mb-2 rounded-2xl w-14 h-14 text-primary">
            {isSignUp ? <UserPlusIcon size={28} /> : <LogInIcon size={28} />}
          </div>
          <h1 className="font-bold text-white text-4xl tracking-tighter">
            tek<span className="text-primary">Chat</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Enterprise Security Active</p>
        </CardHeader>

        <CardBody className="gap-4 px-6 pb-8">
          {error && (
            <div className="flex items-center gap-3 bg-danger-500/10 p-3 border border-danger-500/20 rounded-xl text-danger-300 text-xs animate-shake">
              <MailWarningIcon size={16} />
              <p>{error}</p>
            </div>
          )}

          <Input
            type="text"
            variant="flat"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            startContent={<UserIcon className="text-gray-400" size={18} />}
            endContent={isUsernameValid && <CheckCircle2Icon className="text-success" size={18} />}
            classNames={{ inputWrapper: "bg-white/5 rounded-xl h-14" }}
          />

          <div className="space-y-2">
            <Input
              type={isVisible ? "text" : "password"}
              variant="flat"
              label="Secure Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<LockIcon className="text-gray-400" size={18} />}
              endContent={
                <div className="flex items-center gap-2">
                  {isPasswordSecure && <CheckCircle2Icon className="text-success" size={18} />}
                  <button onClick={() => setIsVisible(!isVisible)} type="button">
                    {isVisible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              }
              classNames={{ inputWrapper: "bg-white/5 rounded-xl h-14" }}
            />
            
            {/* Strength Meter - Only shows when typing in Signup mode */}
            {isSignUp && password.length > 0 && (
              <div className="space-y-1 px-1">
                <Progress 
                  size="sm"
                  radius="full"
                  value={strengthPercentage}
                  color={strengthScore < 3 ? "danger" : strengthScore < 4 ? "warning" : "success"}
                  className="max-w-md"
                />
                <p className="flex justify-between text-[10px] text-gray-500">
                  <span>Strength: {strengthScore < 3 ? 'Weak' : strengthScore < 4 ? 'Fair' : 'Strong'}</span>
                  <span>Min. 8 chars + Symbol + Number</span>
                </p>
              </div>
            )}
          </div>

          {isSignUp && (
            <Input
              type="password"
              variant="flat"
              label="Confirm Secure Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              startContent={<ShieldCheckIcon className="text-gray-400" size={18} />}
              endContent={isConfirmValid && confirmPassword !== "" && <CheckCircle2Icon className="text-success" size={18} />}
              classNames={{ inputWrapper: "bg-white/5 rounded-xl h-14" }}
            />
          )}

          <Button
            size="lg"
            color={(isUsernameValid && (!isSignUp || isPasswordSecure) && isConfirmValid) ? "primary" : "default"}
            onPress={handleAuth}
            isLoading={isLoading}
            className="shadow-primary/10 shadow-xl mt-4 rounded-xl w-full font-bold transition-all"
          >
            {isSignUp ? "Create Secure Account" : "Secure Login"}
          </Button>

          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setPassword(""); }}
            className="mt-2 font-semibold text-primary hover:text-primary-400 text-sm transition-colors"
          >
            {isSignUp ? "Already have an account? Login" : "New User? Create Protected Account"}
          </button>
        </CardBody>
      </Card>
    </div>
  );
}