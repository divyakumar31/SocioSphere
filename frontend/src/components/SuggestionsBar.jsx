import { followUnfollowApi, getSuggestedUsersApi } from "@/api";
import { addSuggestedUsers, addUser } from "@/features/userSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestionsBar = () => {
  // TODO: Set follow handler for suggestions.(Enable Follow button)
  const dispatch = useDispatch();
  const { user, suggestedUser } = useSelector((state) => state.user);

  const fetchUsers = async () => {
    try {
      const res = await getSuggestedUsersApi();
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(addSuggestedUsers(res.data.data));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };
  useEffect(() => {
    if (suggestedUser.length === 0) {
      fetchUsers();
    }
  }, [suggestedUser]);

  // filter out users that the user is already following
  const suggestions = suggestedUser?.filter(
    (u) => !user.following.includes(u._id)
  );

  const handleFollowUnfollow = async (id) => {
    try {
      const res = await followUnfollowApi(id);
      if (res.data.success) {
        console.log(res.data);
        let updatedUser;
        if (user.followers.includes(id)) {
          updatedUser = {
            ...user,
            following: user.following.filter((fid) => fid !== id),
          };
        } else {
          updatedUser = {
            ...user,
            following: [id, ...user.following],
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

  return (
    <>
      <div className="max-w-96 hidden lg:block">
        {/* Profile Details */}
        <div className="flex items-center gap-2 w-80 max-w-96 px-4">
          <Link to={`/${user?.username}`}>
            <Avatar className={"w-12 h-12"}>
              <AvatarImage
                src={user.profilePicture || "/assets/default_img.jpg"}
                className={"object-cover cursor-pointer"}
              />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-auto flex-col">
            <h2 className="font-semibold cursor-pointer w-fit">
              <Link to={`/${user.username}`}>{user.username}</Link>
            </h2>
            <p className="text-gray-400">{user?.name || "sociosphere"}</p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col gap-2 px-4 py-2 mt-4">
          <h2 className="text-lg font-medium text-gray-500">
            Suggestions For You
          </h2>

          {suggestions?.length > 0 ? (
            suggestions?.map((suggestion, index) => {
              if (user.following.includes(suggestion._id)) return null;
              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Link to={`/${suggestion.username}`}>
                    <Avatar className={"w-10 h-10"}>
                      <AvatarImage
                        src={
                          suggestion.profilePicture || "/assets/default_img.jpg"
                        }
                        className={"object-cover cursor-pointer"}
                      />
                      <AvatarFallback>SS</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex flex-auto flex-col">
                    <h2 className="font-semibold cursor-pointer w-fit">
                      <Link to={`/${suggestion.username}`}>
                        {suggestion.username}
                      </Link>
                    </h2>
                    <p className="text-gray-400">
                      {suggestion?.name || "sociosphere"}
                    </p>
                  </div>
                  <div>
                    <button
                      className="text-blue-500 hover:text-blue-600 font-medium text-sm cursor-pointer"
                      onClick={() => handleFollowUnfollow(suggestion._id)}
                    >
                      Follow
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm">No suggestions found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SuggestionsBar;
