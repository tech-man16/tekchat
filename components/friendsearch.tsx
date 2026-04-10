"use client";
import { searchFriend } from "@/app/(server)/actions";
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
import { AddIcon } from "./chatPage";

export const SearchIcon = (props: any) => {
  return (
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
};

export const ProfileIcon = (props: any) => {
  return (
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
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
};

const AddFriendButton = (props: any) => {
  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      onPress={() => alert("clicked add friend button")}
    >
      <AddIcon className="size-3" />
    </Button>
  );
};

const RemoveFriendButton = (props: any) => {
  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      onPress={() => alert("clicked remove friend button")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </Button>
  );
};

export default function SearchFriend() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [friendId, setFriendId] = useState([]);
  const [msg, setMsg] = useState("No friends found.");
  const [val, setVal] = useState("");

  const { key }: any = useContext(chatContext);

  const handleSearch = async (e: any) => {
    console.log("Searching for friend with userId:", e.target.value);
    setVal(e.target.value);
    setMsg("Searching...");
    if (e.target.value.trim() === "" || e.target.value === key.a) {
      setFriendId([]);
      setMsg("No friends found.");
      return;
    }
    const result = await searchFriend({ userId: e.target.value });
    if (result.status === 200) {
      // const userIds = result.data.map((user: any) => user.userId);
      setFriendId(result.data);
      setMsg("Friends found.");
    } else {
      setFriendId([]);
      setMsg("No friends found.");
    }
  };

  return (
    <div className="flex p-3">
      <Button isIconOnly onPress={onOpen}>
        <SearchIcon />
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Search Friend
              </ModalHeader>
              <ModalBody>
                <Input
                  startContent={<ProfileIcon />}
                  endContent={
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => alert("clicked search button")}
                    >
                      <SearchIcon className="size-3" />
                    </Button>
                  }
                  variant="bordered"
                  onChange={handleSearch}
                  value={val}
                />
                <div className="mt-4">
                  {friendId.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {friendId.map((user: any) => (
                        <div key={user.userId} className="flex justify-between">
                          <div>{user.userId}</div>
                          <div>
                            {val in key.loginUser.f ? (
                              <div className="flex items-center gap-2">
                                <Chip color="success" variant="flat">
                                  Friends
                                </Chip>
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="light"
                                  // onPress={() => setStatus("none")}
                                >
                                  -
                                </Button>
                              </div>
                            ) : val in key.loginUser.request ? (
                              <Chip
                                variant="flat"
                                color="warning"
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                // startContent={
                                //   <Clock size={14} className="ml-1" />
                                // }
                                // onClick={() => setStatus("none")} // The toggle logic
                              >
                                Requested (Click to Cancel)
                              </Chip>
                            ) : val in key.loginUser.notify ? (
                              <div className="flex items-center gap-2">
                                <span className="mr-1 font-bold text-default-400 text-tiny uppercase">
                                  Request:
                                </span>
                                <Chip
                                  color="success"
                                  variant="shadow"
                                  className="hover:scale-105 transition-transform cursor-pointer"
                                  // startContent={<Check size={14} />}
                                  // onClick={() => setStatus("friends")}
                                >
                                  Accept
                                </Chip>
                                <Chip
                                  color="danger"
                                  variant="flat"
                                  className="hover:scale-105 transition-transform cursor-pointer"
                                  // startContent={<X size={14} />}
                                  // onClick={() => setStatus("none")}
                                >
                                  Reject
                                </Chip>
                              </div>
                            ) : (
                              <Tooltip content="Add Friend">
                                <AddFriendButton />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{msg}</p>
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
