import { updateUserApi } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { addUser } from "@/features/userSlice";
import { Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [editedProfile, setEditedProfile] = useState({
    bio: user?.bio,
    name: user?.name,
    email: user.email,
    gender: user?.gender,
    profileType: user.profileType,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isChecked, setIsChecked] = useState(
    editedProfile.profileType === "private"
  );

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setEditedProfile({
      ...editedProfile,
      profilePicture: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !/^[a-zA-Z]+[a-zA-Z0-9._]*[a-zA-Z0-9]+@gmail.com$/.test(
        editedProfile.email
      )
    ) {
      toast.error("Please enter a valid email");
    } else {
      setIsLoading(true);
      try {
        const res = await updateUserApi(
          editedProfile,
          selectedFile ? selectedFile : null
        );

        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(addUser(res.data.data));
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-medium text-center w-full mt-4">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="max-w-3xl w-full mx-auto">
          <div className="bg-gray-200 rounded-md p-4 m-2 flex items-center gap-2 flex-wrap">
            <Avatar
              className="w-16 h-16 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <AvatarImage
                src={
                  editedProfile.profilePicture ||
                  user?.profilePicture ||
                  "../assets/default_img.jpg"
                }
                alt={user.username}
                className={"object-cover"}
              />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2 flex-1 min-w-40">
              <h2 className="font-medium">{user?.username}</h2>

              <input
                type="text"
                name="name"
                id="name"
                value={editedProfile.name || ""}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
                placeholder="Your name..."
                className="border-b border-b-gray-400 outline-none w-full"
              />
            </div>
            <div>
              <input
                type="file"
                id="file"
                name="file"
                accept={"image/jpeg, image/png, image/jpg"}
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant={"secondary"}
                className={
                  "text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
                }
                onClick={() => fileInputRef.current.click()}
              >
                Change Photo
              </Button>
            </div>
          </div>

          {/* Email */}
          <div className="p-4">
            <h2 className="font-medium text-lg mb-2">Email</h2>
            <input
              name="email"
              id="email"
              type="email"
              required={true}
              onChange={(e) => {
                setEditedProfile({ ...editedProfile, email: e.target.value });
              }}
              value={editedProfile.email}
              placeholder="Your email..."
              className="border rounded-md w-full p-2"
            />
          </div>
          {/* Bio */}
          <div className="p-4">
            <h2 className="font-medium text-lg mb-2">Bio</h2>
            <div className="relative">
              <textarea
                name="bio"
                id="bio"
                row={3}
                onChange={(e) => {
                  setEditedProfile({ ...editedProfile, bio: e.target.value });
                }}
                value={editedProfile.bio || ""}
                className="border rounded-md w-full p-2 resize-y scrollbar-none"
              ></textarea>
              <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                {editedProfile.bio?.length || 0}/100
              </span>
            </div>
          </div>
          {/* Gender */}
          <div className="p-4 flex">
            <h2 className="font-medium text-lg mr-2">Gender</h2>
            <select
              name="gender"
              id="gender"
              value={editedProfile.gender || ""}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, gender: e.target.value })
              }
              className="px-4 py-2 rounded-md outline"
            >
              <option value="select">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* ProfileType */}
          <div className="p-4 flex">
            <h2 className="font-medium text-lg mr-2">Private Profile</h2>
            <label className="flex cursor-pointer select-none items-center w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    setEditedProfile({
                      ...editedProfile,
                      profileType: isChecked ? "public" : "private",
                    });
                    setIsChecked(!isChecked);
                  }}
                  className="sr-only"
                />
                <div
                  className={`block h-6 w-10 rounded-full ${
                    isChecked ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                    isChecked ? "translate-x-full" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>

          <Button
            variant={"default"}
            className={
              "cursor-pointer text-white bg-blue-500 hover:bg-blue-600 px-10 py-4 rounded-md m-4 text-base"
            }
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
