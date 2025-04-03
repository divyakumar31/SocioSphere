import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { setChatList, setSelectedChat } from "@/features/chatSlice";
import { MoveLeftIcon } from "lucide-react";

const ChatList = ({ id }) => {
  const { chatList, onlineUsers } = useSelector((state) => state.chat);
  const { user, suggestedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setChatList(suggestedUser));

    return () => {
      dispatch(setSelectedChat(null));
    };
  }, [suggestedUser]);

  return (
    <div
      className={`sm:max-w-60 w-full flex flex-col border-r p-2 sm:p-4 ${
        id ? "hidden sm:flex" : ""
      }`}
    >
      <p className="text-2xl font-semibold flex items-center">
        <span className="mr-2">
          <MoveLeftIcon onClick={() => navigate("/")} />
        </span>
        &#64; {user.username}
      </p>
      <h1 className="font-semibold mt-4">Chats</h1>

      <div className="mt-4 space-y-2 overflow-scroll scrollbar-none">
        {chatList?.map((u) => (
          <Link
            key={u._id}
            to={`/inbox/${u._id}`}
            className={`flex items-center gap-2 px-1 py-2 hover:bg-gray-200 cursor-pointer rounded-lg ${
              u._id === id ? "bg-gray-200" : ""
            }`}
          >
            <div className="relative">
              <Avatar className={"w-10 h-10"}>
                <AvatarImage
                  src={u?.profilePicture}
                  alt={`${u.username}'s chat`}
                  className={"object-cover cursor-pointer"}
                />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
              {onlineUsers.includes(u._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
              )}
            </div>

            <div className="flex flex-col">
              <p className="">{u.username}</p>
              <p className="text-sm text-gray-400 w-40 truncate">
                {u.name || "lorem"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
