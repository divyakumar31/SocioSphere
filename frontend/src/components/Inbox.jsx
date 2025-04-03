import React from "react";
import { ChatList, Chats } from ".";
import { useParams } from "react-router-dom";

const Inbox = () => {
  const { id } = useParams();
  return (
    <div className="flex w-full h-screen">
      <ChatList id={id} />
      <Chats id={id} />
    </div>
  );
};

export default Inbox;
