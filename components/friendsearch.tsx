import { searchFriend } from "@/app/(server)/actions";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useState } from "react";

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

export default function SearchFriend() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [friendId, setFriendId] = useState([]);
  const [msg, setMsg] = useState("No friends found.");

  const handleSearch = async (e: any) => {
    console.log("Searching for friend with userId:", e.target.value);
    setMsg("Searching...");
    if (e.target.value.trim() === "") {
      setFriendId([]);
      setMsg("No friends found.");
      return;
    }
    const result = await searchFriend({ userId: e.target.value });
    if (result.status === 200) {
      const userIds = result.data.map((user: any) => user.userId);
      setFriendId(userIds);
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
                />
                <div className="mt-4">
                  {friendId.length > 0 ? (
                    <ul>
                      {friendId.map((id: string) => (
                        <li key={id}>{id}</li>
                      ))}
                    </ul>
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
