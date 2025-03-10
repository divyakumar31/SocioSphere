import { addPostApi } from "@/api";
import { addPost } from "@/features/postSlice";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Loader2Icon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "./ui/dialog";

const CreatePost = ({ open, setOpen, handleMainDialog }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedFile) {
        toast.error("Post requires an image.");
        return;
      }
      const res = await addPostApi(caption, selectedFile);

      if (res.data.success) {
        dispatch(addPost(res.data.data));
        // TODO: push post in user.post in userSlice
        // user.posts.push(res.data.data._id);
        toast.success(res.data.message);
        handleDialogClose();
        handleMainDialog(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    processFiles(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    processFiles(event.dataTransfer.files[0]);
  };

  const processFiles = (file) => {
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");
    console.log(fileTypeRegex, "fileTypeRegex");
    if (!fileTypeRegex.test(file.name.split(".").pop())) {
      setError(`Only ${acceptedFileExtensions.join(", ")} files are allowed`);
      hasError = true;
    }

    if (!hasError) {
      setError("");
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCustomButtonClick = () => {
    // Trigger the click event of the hidden file input
    fileInputRef.current.click();
  };

  const handleDialogClose = () => {
    setSelectedFile([]);
    setPreviewImage(null);
    setOpen(false);
    setCaption("");
  };

  return (
    <>
      <Dialog open={open}>
        <DialogOverlay className={"opacity-50 bg-black/80"} />
        <DialogContent className="w-96" onInteractOutside={handleDialogClose}>
          <DialogTitle className={"text-center font-medium"}>
            Create Post
          </DialogTitle>
          <div className="w-full flex items-center gap-2">
            <Link to={`/${user?.username}`}>
              <Avatar className={"w-12 h-12"}>
                <AvatarImage
                  src={user?.profilePicture || "/assets/default_img.jpg"}
                  className={"object-cover cursor-pointer"}
                />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h2 className="font-medium cursor-pointer">
                <Link to={`/${user?.username}`}>{user?.username}</Link>
              </h2>
              <p className="text-sm text-gray-500">{user?.name || " "}</p>
            </div>
          </div>

          {previewImage ? (
            <>
              {/* To add caption */}
              <div className="w-full">
                <textarea
                  type="text"
                  name="caption"
                  id="caption"
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Caption..."
                  className="w-full py-1.5 outline-none resize-none rounded-md border-b"
                />
              </div>
              <div className="relative min-w-80 w-80 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={previewImage}
                  alt={selectedFile.name}
                  className="min-w-80 w-80 aspect-square object-cover"
                />
                <XIcon
                  onClick={() => {
                    setSelectedFile([]);
                    setPreviewImage(null);
                    setCaption("");
                  }}
                  className="absolute top-2 right-2 cursor-pointer bg-gray-200 rounded-full"
                />
              </div>
              <div className="flex justify-center mt-2">
                {error && (
                  <p className="text-red-500 mt-2 text-center">{error}</p>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex">
                      <Loader2Icon className="mr-2 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className="min-h-80 border-2 border-dashed border-blue-500 bg-blue-100 rounded-lg p-4 flex flex-col justify-center items-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e)}
              >
                <p className="text-lg font-medium">Drag and Drop the file</p>
                <p className="text-lg">or</p>
                <button
                  type="button"
                  onClick={handleCustomButtonClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Upload File
                </button>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept={acceptedFileTypesString}
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  onClick={(event) => {
                    // Reset the input value to allow selecting the same file again
                    event.target.value = null;
                  }}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;
