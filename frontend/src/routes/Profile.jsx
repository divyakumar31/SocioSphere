import { followUnfollowApi, getUserProfileApi, logoutUserApi } from "@/api";
import { ProfilePostImage } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { removeChat } from "@/features/chatSlice";
import { removePosts } from "@/features/postSlice";
import { addUser, removeUser } from "@/features/userSlice";
import { closeSocket } from "@/lib/socket";
import { LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  // TODO: Handle Action buttons, Change Saved posts as it currently shows user poss
  const { username } = useParams();
  const { user } = useSelector((state) => state.user);
  const userPosts = useSelector((state) => state.post.post);
  const [showContent, setShowContent] = useState("Posts");
  const [profileUser, setProfileUser] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getProfileUserDetails = async () => {
    if (username === user.username || username === "profile") {
      document.title = `Profile | ${user.username}`;
      setProfileUser({
        ...user,
        posts: userPosts.filter((p) => p.author._id === user._id),
        savedPosts: userPosts.filter((p) => {
          if (user.savedPosts.includes(p._id)) {
            return p;
          }
        }),
      });
    } else {
      try {
        const res = await getUserProfileApi(username);
        if (res.data.success) {
          setProfileUser(res.data.data);
          document.title = `${res.data.data.username}'s profile`;
        }
      } catch (error) {
        navigate("/404", { replace: true });
        toast.error(
          error.response?.data.message || "Check your internet connection"
        );
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getProfileUserDetails();

    return () => {
      document.title = "Social Circle";
    };
  }, [username, user]);

  const handleShareProfile = () => {
    try {
      navigator.clipboard.writeText(
        `${import.meta.env.VITE_BASE_URL}/${profileUser.username}?shid=${
          user._id
        }`
      );
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Unable to copy link");
    }
  };

  const handleFollowUnfollow = async () => {
    try {
      const res = await followUnfollowApi(profileUser._id);
      if (res.data.success) {
        console.log(res.data);
        let updatedUser;
        if (profileUser.followers.includes(user._id)) {
          setProfileUser({
            ...profileUser,
            followers: profileUser.followers.filter((fid) => fid !== user._id),
          });
          updatedUser = {
            ...user,
            following: user.following.filter((fid) => fid !== profileUser._id),
          };
        } else {
          setProfileUser({
            ...profileUser,
            followers: [user._id, ...profileUser.followers],
          });
          updatedUser = {
            ...user,
            following: [profileUser._id, ...user.following],
          };
        }
        dispatch(addUser(updatedUser));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUserApi();
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(removeUser());
        dispatch(removePosts());
        dispatch(removeChat());
        closeSocket();
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data.message || "Check your internet connection"
      );
    }
  };

  const ProfileActions = () => {
    return (
      <>
        {user._id === profileUser._id ? (
          <>
            <Button
              variant={"secondary"}
              className={
                "bg-transparent shadow border hover:bg-gray-100 cursor-pointer px-8"
              }
              onClick={() => navigate("/e/profile")}
            >
              Edit Profile
            </Button>
            <Button
              variant={"secondary"}
              className={
                "bg-transparent shadow border hover:bg-gray-100 cursor-pointer px-8"
              }
              onClick={handleShareProfile}
            >
              Share Profile
            </Button>
            <LogOutIcon
              className="cursor-pointer inline-block xsm:hidden"
              onClick={handleLogout}
            />
          </>
        ) : (
          <>
            {profileUser.followers?.includes(user._id) ? (
              <>
                <Button
                  variant={"secondary"}
                  className={
                    "bg-blue-500 hover:bg-blue-600 cursor-pointer px-8 text-white"
                  }
                  onClick={handleFollowUnfollow}
                >
                  Unfollow
                </Button>
                <Button
                  variant={"secondary"}
                  className={
                    "bg-transparent shadow border hover:bg-gray-100 cursor-pointer px-8"
                  }
                  onClick={() => navigate(`/inbox/${profileUser._id}`)}
                >
                  Message
                </Button>
              </>
            ) : (
              <Button
                variant={"secondary"}
                className={
                  "bg-blue-500 hover:bg-blue-600 cursor-pointer px-8 text-white"
                }
                onClick={handleFollowUnfollow}
              >
                Follow
              </Button>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div className="w-full h-screen overflow-scroll scrollbar-none p-2 xsm:p-4">
        <div className="max-w-3xl m-auto">
          <div className="flex gap-4 mb-2">
            {/* Profile User Image */}
            <Avatar className={"w-24 h-24 xsm:w-40 xsm:h-40"}>
              <AvatarImage
                src={profileUser.profilePicture || "../assets/default_img.jpg"}
                alt={`${
                  profileUser.name || profileUser.username
                }'s profile picture`}
                className={"object-cover"}
              />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>

            {/* Username, name, followers */}
            <div className="flex flex-col justify-evenly flex-1">
              {/* Username & profile actions */}
              <div className="flex items-center justify-between w-full">
                <h1 className="text-lg xsm:text-2xl min-w-40 truncate">
                  {profileUser.username}
                </h1>
                <div className="space-x-2 hidden lg:block">
                  <ProfileActions />
                </div>
              </div>
              {/* User's name */}
              {profileUser?.name && (
                <div>
                  <h2 className="font-medium xsm:text-lg xsm:font-semibold">
                    {profileUser?.name}
                  </h2>
                </div>
              )}
              {/* User's follower & followings */}
              <div className="flex gap-4 xsm:text-lg">
                <p className="text-gray-500">
                  <span className="font-medium text-black">
                    {profileUser.followers?.length}
                  </span>{" "}
                  followers
                </p>
                <p className="text-gray-500">
                  <span className="font-medium text-black">
                    {profileUser.following?.length}
                  </span>{" "}
                  following
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profileUser.bio && (
            <div className="xsm:px-4 my-2">
              <p>{profileUser.bio}</p>
            </div>
          )}

          <div className="xsm:px-4 my-2 space-x-2 block lg:hidden">
            <ProfileActions />
          </div>

          {/* User post & tweets & saved posts */}
          <div className="border-b-2 xsm:px-4 border-b-gray-300 flex gap-2">
            <h2
              className={`p-2 rounded-t-md hover:bg-gray-200 cursor-pointer ${
                showContent === "Posts" && "font-medium bg-gray-200"
              }`}
              onClick={() => setShowContent("Posts")}
            >
              <span className="mr-2">{profileUser.posts?.length || 0}</span>
              Posts
            </h2>
            <h2
              className={`p-2 rounded-t-md hover:bg-gray-200 cursor-pointer ${
                showContent === "Tweets" && "font-medium bg-gray-200"
              }`}
              onClick={() => setShowContent("Tweets")}
            >
              <span className="mr-2">{profileUser.tweets?.length || 0}</span>
              Tweets
            </h2>
            {(username === user.username || username === "profile") && (
              <h2
                className={`p-2 rounded-t-md hover:bg-gray-200 cursor-pointer ${
                  showContent === "Saved" && "font-medium bg-gray-200"
                }`}
                onClick={() => setShowContent("Saved")}
              >
                <span className="mr-2">
                  {profileUser?.savedPosts?.length || 0}
                </span>
                Saved
              </h2>
            )}
          </div>

          {/* User Posts */}
          {showContent === "Posts" && (
            <>
              <div className="xsm:p-4 grid grid-cols-2 lg:grid-cols-3 gap-2">
                {profileUser.posts?.map((post) => (
                  <ProfilePostImage
                    key={post._id}
                    post={post}
                    userId={user._id}
                  />
                ))}
              </div>
            </>
          )}

          {/* User Tweets */}
          {showContent === "Tweets" && (
            <>
              <div className="p-2 xsm:p-4 flex flex-col gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                  (index) => (
                    <span key={index}>{`Tweet ${index}`}</span>
                  )
                )}
              </div>
            </>
          )}

          {/* user Saved Posts */}
          {(username === user.username || username === "profile") &&
            showContent === "Saved" && (
              <>
                <div className="xsm:p-4 grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {profileUser.savedPosts?.map((post) => (
                    <ProfilePostImage
                      key={post._id}
                      post={post}
                      userId={user._id}
                    />
                  ))}
                </div>
              </>
            )}
        </div>
      </div>
    </>
  );
};

export default Profile;
