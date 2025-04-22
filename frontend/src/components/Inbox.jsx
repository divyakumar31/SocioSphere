import React from "react";
import { ChatList, Chats } from ".";
import { useParams } from "react-router-dom";
import { MessageCircleMoreIcon } from "lucide-react";

const Inbox = () => {
  const { id } = useParams();
  return (
    <div className="flex w-full h-screen">
      <ChatList id={id} />
      {id ? (
        <Chats id={id} />
      ) : (
        <div className="flex-col items-center justify-center h-full w-full hidden sm:flex">
          <MessageCircleMoreIcon className="w-16 h-16" />
          <p>Start Chat with your friends</p>
        </div>
      )}
    </div>
  );
};

export default Inbox;
