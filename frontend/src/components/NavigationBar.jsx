import { logoutUserApi } from "@/api";
import { removeUser } from "@/features/userSlice";
import {
  CompassIcon,
  HeartIcon,
  HomeIcon,
  HouseIcon,
  LogOutIcon,
  MessageCircleMoreIcon,
  SearchIcon,
  SettingsIcon,
  SquarePlusIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { CreatePost } from ".";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Create } from "@/routes";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: [<HouseIcon />, <HouseIcon strokeWidth={2.5} />],
  },
  {
    name: "Search",
    path: "/search",
    icon: [<SearchIcon />, <SearchIcon strokeWidth={2.5} />],
  },
  {
    name: "Explore",
    path: "/explore",
    icon: [<CompassIcon />, <CompassIcon strokeWidth={2.5} />],
  },
  {
    name: "Message",
    path: "/inbox",
    icon: [
      <MessageCircleMoreIcon />,
      <MessageCircleMoreIcon strokeWidth={2.5} />,
    ],
  },
  {
    name: "Notifications",
    path: "/notification",
    icon: [<HeartIcon />, <HeartIcon fill="red" strokeWidth={2.5} />],
  },
  {
    name: "Create",
    path: "/create",
    icon: [<SquarePlusIcon />, <SquarePlusIcon strokeWidth={2.5} />],
  },
  {
    name: "Profile",
    path: "/profile",
    icon: (userImage) => (
      <Avatar className={"w-6 h-6"}>
        <AvatarImage src={userImage} className={"object-cover"} />
        <AvatarFallback>SS</AvatarFallback>
      </Avatar>
    ),
  },
  {
    name: "Settings",
    path: "/setting",
    icon: [<SettingsIcon />, <SettingsIcon strokeWidth={2.5} />],
  },
  {
    name: "Logout",
    path: "/logout",
    icon: [<LogOutIcon />, <LogOutIcon strokeWidth={2.5} />],
  },
];

const NavigationBar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCreatePostModelOpen, setIsCreatePostModelOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await logoutUserApi();
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(removeUser());
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data.message || "Check your internet connection"
      );
    }
  };

  const handleClick = (e, item) => {
    e.preventDefault();
    if (item.name === "Logout") {
      handleLogout();
    } else if (item.name === "Profile" || item.name === "Home") {
      navigate(item.path);
    } else if (item.name === "Create") {
      setIsCreatePostModelOpen(true);
    } else {
      console.log("CLicked", item);
    }
  };

  return (
    <>
      {/* NavBar for md and above */}
      <div className="hidden xsm:flex p-4  flex-col items-center md:w-full h-screen sticky top-0 left-0 md:max-w-60 border-r">
        {/* Logo */}
        <NavLink to="/">
          <img
            src="/assets/SocioSphere-dark-logo.png"
            alt="SocioSphere LOGO"
            className="max-w-40 md:block hidden"
          />
          <img
            src="/assets/dp.png"
            alt="SocioSphere LOGO"
            className="w-10 md:hidden block"
          />
        </NavLink>

        {/* NavItems */}
        <div className="flex flex-col gap-4 mt-4 w-full">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 text-lg p-2 rounded-md hover:bg-gray-100 ${
                  isActive ? "bg-gray-100 font-medium" : ""
                }`
              }
              title={item.name}
              onClick={(e) => handleClick(e, item)}
            >
              {({ isActive }) => (
                <>
                  <span className="w-full max-w-7">
                    {item.name === "Profile" &&
                      item.icon(
                        user?.profilePicture || "/assets/default_img.jpg"
                      )}
                    {isActive ? item?.icon[1] : item?.icon[0]}
                  </span>
                  <span className="hidden md:block">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Navbar for sm and below */}
      {/* Header */}
      <div className="flex xsm:hidden fixed top-0 z-10 bg-white border-b w-full h-14">
        <div className="flex items-center justify-between w-full p-2">
          <NavLink to="/">
            <img
              src="/assets/SocioSphere-dark-logo.png"
              alt="SocioSphere LOGO"
              className="max-w-30 cursor-pointer"
            />
          </NavLink>
          <div className="flex items-center gap-2">
            {/* Notification */}
            <div className="relative">
              <HeartIcon
                onClick={(e) => handleClick(e, navItems[4])}
                className="cursor-pointer"
              />

              {/* <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                3
              </span> */}
            </div>
            {/* Messages */}
            <div className="relative">
              <MessageCircleMoreIcon
                onClick={(e) => handleClick(e, navItems[3])}
                className="cursor-pointer"
              />
              {/* <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                3+
              </span> */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex xsm:hidden fixed bottom-0 z-10 bg-white border-t w-full h-14">
        <div className="flex items-center justify-between w-full p-2">
          <HomeIcon
            onClick={(e) => handleClick(e, navItems[0])}
            className="cursor-pointer"
          />
          <SearchIcon
            onClick={(e) => handleClick(e, navItems[1])}
            className="cursor-pointer"
          />
          <SquarePlusIcon
            onClick={(e) => handleClick(e, navItems[5])}
            className="cursor-pointer"
          />
          <Avatar
            className={"w-6 h-6 cursor-pointer"}
            onClick={(e) => handleClick(e, navItems[6])}
          >
            <AvatarImage
              src={user?.profilePicture || "/assets/default_img.jpg"}
              alt={`${user?.name}'s profile picture`}
              className={"object-cover"}
            />
            <AvatarFallback>SS</AvatarFallback>
          </Avatar>
        </div>
      </div>
      {isCreatePostModelOpen && (
        <Create setIsCreatePostModelOpen={setIsCreatePostModelOpen} />
      )}
    </>
  );
};

export default NavigationBar;
