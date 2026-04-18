"use client";

import React, { useContext } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
  Badge,
} from "@heroui/react";
import { updateStatus } from "@/app/(server)/actions";
import { chatContext } from "@/app/context/context";

const BellIcon = (props: any) => {
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
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
};

export default function NotificationDrawer({ data }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { key, setKey } = useContext(chatContext);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    if (key?.login) {
      const statuses = key.loginUser.status || {};
      const filteredData: any = Object.entries(statuses)
        .filter(([key, value]: any) => value.includes("requested"))
        .map(([key, value]) => ({
          id: key,
          details: value,
        }));
      setNotifications(filteredData);
    }
  }, [key]);

  const handleReq = async (req: string, userB: any) => {
    const res = await updateStatus({
      userA: { ID: data.userA.ID, name: data.userA.name },
      userB,
      statusRequest: req,
    });

    if (res.status === 200) {
      setNotifications((prev: any) =>
        prev.filter((notification: any) => notification.id !== userB.ID),
      );
      if (req === "accept") {
        setKey((prev: any) => {
          const updatedStatus = {
            ...prev.loginUser.status,
            [userB.ID]: [userB.name, "accepted"], // Updated to "accepted" for consistency
          };
          return {
            ...prev,
            loginUser: {
              ...prev.loginUser,
              status: updatedStatus,
            },
          };
        });
      } else {
        setKey((prev: any) => {
          const updatedStatus = { ...prev.loginUser.status };
          delete updatedStatus[userB.ID];
          return {
            ...prev,
            loginUser: {
              ...prev.loginUser,
              status: updatedStatus,
            },
          };
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Badge
          color="danger" // Red badge stands out better on dark purple
          content={notifications.length}
          isInvisible={notifications.length === 0}
          shape="circle"
        >
          <Button 
            isIconOnly 
            onPress={onOpen}
            className="bg-[#1a1425] hover:bg-[#2d213f] border border-[#2d213f] text-purple-400 transition-colors"
          >
            <BellIcon />
          </Button>
        </Badge>
      </div>

      <Drawer 
        isOpen={isOpen} 
        size="sm" 
        onClose={onClose}
        className="bg-[#0f0a19] border-[#2d213f] border-l text-[#e9d5ff]"
      >
        <DrawerContent className="bg-[#0f0a19]">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 border-[#2d213f] border-b text-white">
                <span className="font-bold text-xl tracking-tight">Friend Requests</span>
              </DrawerHeader>
              <DrawerBody className="py-6">
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center gap-4 bg-[#150f24] p-3 border border-[#2d213f] rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex justify-center items-center bg-[#7c3aed] rounded-full w-8 h-8 font-bold text-white text-xs">
                            {notification.details[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{notification.details[0]}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-[#7c3aed] hover:bg-[#6d28d9] min-w-[70px] font-semibold text-white"
                            onPress={() =>
                              handleReq("accept", {
                                ID: notification.id,
                                name: notification.details,
                              })
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            className="bg-transparent hover:bg-red-500/10 border border-red-500/50 min-w-[70px] text-red-400"
                            onPress={() =>
                              handleReq("reject", {
                                ID: notification.id,
                                name: notification.details,
                              })
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center opacity-50 h-40">
                    <BellIcon />
                    <p className="mt-2 text-sm">No new requests</p>
                  </div>
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}