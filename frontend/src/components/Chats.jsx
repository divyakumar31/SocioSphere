import { getMessagesApi, sendMessageApi } from "@/api";
import { setMessages } from "@/features/chatSlice";
import { useRealTimeMessages } from "@/hooks/useRealTimeMessage";
import { MoveLeftIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Chats = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const { selectedChat, messages } = useSelector((state) => state.chat);

  const [textMessage, setTextMessage] = useState("");
  const messageContainerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useRealTimeMessages();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendMessageApi(selectedChat?._id, textMessage);
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.data]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await getMessagesApi(id);
        if (res.data.success) {
          dispatch(setMessages(res.data.data));
        } else {
          dispatch(setMessages([]));
        }
      } catch (error) {
        toast.error(error.response?.data.message);
      }
    };

    if (id) {
      getMessages();
    }
  }, [selectedChat, id]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex flex-col h-full max-h-screen w-full">
      {/* Chat Header (username,profilePicture & back button) */}
      <header className="flex items-center gap-2 p-2 xsm:p-4">
        <MoveLeftIcon onClick={() => navigate("/inbox")} />
        <Avatar className={"w-12 h-12"}>
          <AvatarImage
            src={selectedChat?.profilePicture}
            alt={`${selectedChat?.username}'s chat`}
            className={"object-cover cursor-pointer"}
          />
          <AvatarFallback>SS</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <Link to={`/${selectedChat?.username}`} className="font-medium">
            {selectedChat?.username}
          </Link>
          <p className="text-sm text-gray-400 w-40 truncate">
            {selectedChat?.name}
          </p>
        </div>
      </header>
      <section
        role="chats"
        className="flex-1 w-full overflow-scroll scrollbar-none p-4"
        ref={messageContainerRef}
      >
        {messages.length > 0 &&
          messages?.map((message, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-2 w-full ${
                message.sender === user._id ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className={"w-8 h-8 cursor-pointer self-end"}>
                <AvatarImage
                  src={
                    message.sender === user._id
                      ? user.profilePicture
                      : selectedChat?.profilePicture
                  }
                  alt={
                    message.sender === user._id
                      ? user.username
                      : selectedChat?.username
                  }
                  className={"object-cover cursor-pointer"}
                />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
              <div
                className={`flex items-center gap-1 w-full ${
                  message.sender === user._id ? "flex-row-reverse" : ""
                }`}
              >
                <p
                  className={`${
                    message.sender === user._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  } px-2 py-1 rounded-md max-w-10/12`}
                >
                  {message.message}
                </p>
                {/* <p
                className={`${
                  message.sender === "You" ? "text-right" : "text-left"
                } text-xs text-gray-500`}
              >
                {message.time}
              </p> */}
              </div>
            </div>
          ))}

        {messages?.length === 0 && (
          <p className="text-center text-gray-500 h-full place-content-center">
            No messages
          </p>
        )}
      </section>
      <div className="p-2 xsm:p-4">
        <form
          onSubmit={handleSubmit}
          role="message-input"
          className="flex items-center w-full gap-2 relative"
        >
          <input
            type="text"
            name="textMessage"
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            autoFocus={true}
            placeholder="Type your message..."
            className="w-full p-2 border border-gray-300 rounded-md pr-12"
          />
          <SendIcon
            className={`text-sm cursor-pointer  transition duration-500 ease-in-out absolute right-2 ${
              textMessage.trim() ? "text-blue-500" : "text-gray-400 rotate-45"
            }`}
            onClick={textMessage.trim() ? handleSubmit : null}
          />
        </form>
      </div>
    </div>
  );
};

export default Chats;
