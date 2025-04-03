import { Inbox, NavigationBar } from "@/components";

const ChatLayout = () => {
  return (
    <div className="flex w-full">
      <div className="hidden md:block md:max-w-60 w-full">
        <NavigationBar />
      </div>
      <div className="w-full h-screen overflow-scroll scrollbar-none">
        <Inbox />
      </div>
    </div>
  );
};

export default ChatLayout;
