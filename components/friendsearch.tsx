"use client";
import { searchFriend, updateStatus } from "@/app/(server)/actions";
import { chatContext } from "@/app/context/context";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  Tooltip,
  Chip,
} from "@heroui/react";

import { useContext, useState } from "react";

// --- ICONS ---

export const AddIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className || "size-6"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

export const SearchIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={`size-6 ${props.className || ""}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

export const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-5 text-purple-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

// --- SEARCH FRIEND COMPONENT ---

export default function SearchFriend() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [friendId, setFriendId] = useState([]);
  const [msg, setMsg] = useState("No friends found.");
  const [val, setVal] = useState("");

  const { key }: any = useContext(chatContext);

  const handleSearch = async (e: any) => {
    const searchVal = e.target.value;
    setVal(searchVal);
    setMsg("Searching...");

    if (searchVal.trim() === "" || searchVal === key.loginUser.userId) {
      setFriendId([]);
      setMsg("No friends found.");
      return;
    }

    const result = await searchFriend({ userId: searchVal });
    if (result.status === 200) {
      setFriendId(result.data);
      setMsg("Friends found.");
    } else {
      setFriendId([]);
      setMsg("No friends found.");
    }
  };

  const handleStatusUpdate = async (status: string, user: any) => {
    try {
      const res = await updateStatus({
        userA: { ID: key.a, name: key.loginUser.userId },
        userB: { ID: user._id, name: user.userId },
        statusRequest: status,
      });
      if (res.status !== 200) {
        alert("Failed to update status: " + res.msg);
      }
    } catch (error) {
      alert("An error occurred while updating status.");
    }
  };

  return (
    <div className="flex">
      <Button
        isIconOnly
        onPress={onOpen}
        className="bg-[#1a1425] hover:bg-[#7c3aed] border border-[#2d213f] text-purple-400 hover:text-white transition-all"
      >
        <SearchIcon className="size-5" />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "bg-[#0f0a19] border border-[#2d213f] text-[#e9d5ff]",
          header: "border-b border-[#2d213f] text-white",
          body: "py-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-bold text-xl">
                Find People
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  placeholder="Enter username..."
                  startContent={<ProfileIcon />}
                  variant="bordered"
                  value={val}
                  onChange={handleSearch}
                  classNames={{
                    input: "text-white",
                    inputWrapper:
                      "border-[#2d213f] hover:border-[#7c3aed] focus-within:!border-[#7c3aed] bg-[#150f24]",
                    label: "text-purple-300",
                  }}
                />

                <div className="mt-6 min-h-[100px]">
                  {friendId.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {friendId.map((user: any) => (
                        <div
                          key={user.userId}
                          className="flex justify-between items-center bg-[#150f24] hover:bg-[#1a1425] p-3 border border-[#2d213f] rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex justify-center items-center bg-gradient-to-tr from-[#7c3aed] to-[#d8b4fe] rounded-full w-9 h-9 font-bold text-white">
                              {user.userId.toUpperCase()}
                            </div>
                            <span className="font-medium text-white">
                              {user.userId}
                            </span>
                          </div>

                          <div className="flex items-center">
                            {/* logic checks based on your specific nested key structure */}
                            {key.loginUser.status?.[user._id]?.includes(
                              "accepted",
                            ) ? (
                              <Chip
                                color="success"
                                variant="flat"
                                className="bg-green-500/10 border-green-500/20 text-green-400"
                              >
                                Friends
                              </Chip>
                            ) : key.loginUser.status?.[user._id]?.includes(
                                "requested",
                              ) ? (
                              <Chip
                                color="warning"
                                variant="flat"
                                className="bg-orange-500/10 border-orange-500/20 text-orange-400"
                              >
                                Pending
                              </Chip>
                            ) : (
                              <Tooltip
                                content="Send Request"
                                className="bg-[#7c3aed] text-white"
                              >
                                <Button
                                  isIconOnly
                                  size="sm"
                                  className="bg-[#7c3aed] hover:bg-[#6d28d9] shadow-lg shadow-purple-900/20 rounded-full text-white"
                                  onPress={() =>
                                    handleStatusUpdate("request", user)
                                  }
                                >
                                  <AddIcon className="size-4" />
                                </Button>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center opacity-40 py-8">
                      <SearchIcon className="mb-2 size-12" />
                      <p className="text-sm italic">{msg}</p>
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
