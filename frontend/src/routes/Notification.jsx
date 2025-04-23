import { seenNotificationsApi } from "@/api";
import { MessageCircleHeartIcon, ThumbsUpIcon, UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const { user } = useSelector((state) => state.user);

  const seenNotifications = async () => {
    try {
      const res = await seenNotificationsApi();
      if (res.data.success) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = `Notifications (${user?.notifications?.length})`;

    return () => {
      document.title = `Social Circle`;
      seenNotifications();
    };
  }, []);

  return (
    <div className="p-2 xsm:p-4 overflow-scroll scrollbar-none h-screen w-full">
      <div className="flex flex-col w-full justify-center gap-4">
        {user?.notifications?.length === 0 && <p>No notifications</p>}
        {user?.notifications?.map((notification, index) => (
          <p
            key={index}
            className="font-medium p-2 border rounded-lg flex gap-2 items-center"
          >
            <span>
              {notification.includes("liked") && (
                <ThumbsUpIcon
                  className="rounded-sm p-1 w-8 h-8"
                  stroke="blue"
                />
              )}
              {notification.includes("commented") && (
                <MessageCircleHeartIcon
                  className="rounded-sm p-1 w-8 h-8"
                  stroke="green"
                />
              )}
              {notification.includes("following") && (
                <UserIcon className="rounded-sm p-1 w-8 h-8" stroke="red" />
              )}
            </span>
            {notification}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Notification;
