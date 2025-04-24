import { addCommentApi, deleteCommentApi } from "@/api";
import { setComments, setCurrentPost } from "@/features/postSlice";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CalculateTime } from ".";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "./ui/dialog";

const CommentBox = ({ userId }) => {
  const { post, currentPost } = useSelector((state) => state.post);
  const [userComment, setUserComment] = useState("");
  const dispatch = useDispatch();
  const handleUserComment = (e) => {
    setUserComment(e.target.value);
  };

  // To add Comment on currentPost
  const submitUserComment = async (e) => {
    e.preventDefault();
    try {
      const res = await addCommentApi(userComment, currentPost._id);
      if (res.data.success) {
        const updatedPost = {
          ...currentPost,
          comments: [res.data.data, ...currentPost.comments],
        };
        dispatch(
          setComments({
            postId: currentPost._id,
            comments: updatedPost.comments,
          })
        );
        dispatch(setCurrentPost(updatedPost));
        toast.success(res.data.message);
        setUserComment("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };
  const handleDeleteComment = async (id) => {
    try {
      const res = await deleteCommentApi(id);
      if (res.data.success) {
        const updatedPost = {
          ...currentPost,
          comments: currentPost.comments.filter(
            (comment) => comment._id !== id
          ),
        };
        dispatch(
          setComments({
            postId: currentPost._id,
            comments: updatedPost.comments,
          })
        );
        dispatch(setCurrentPost(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 p-0 w-full gap-2 overflow-scroll scrollbar-none h-full max-h-96">
        <img
          src={currentPost.image}
          alt={currentPost.caption}
          className="w-full object-contain self-center hidden md:block"
        />
        <div className="p-2 h-96 relative flex flex-col">
          {/* currentPost Author details  */}
          <div className="flex items-center gap-2">
            <Link to={`/${currentPost.author?.username}`}>
              <Avatar className={"w-8 h-8"}>
                <AvatarImage
                  src={
                    currentPost.author?.profilePicture ||
                    "../assets/default_img.jpg"
                  }
                  className={"object-cover cursor-pointer"}
                />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-auto">
              <h2 className="font-medium cursor-pointer">
                <Link to={`/${currentPost.author?.username}`}>
                  {currentPost.author?.username}
                </Link>
              </h2>
            </div>
            <Dialog>
              <DialogOverlay className={"bg-black/50"} />
              <DialogTrigger asChild>
                <Ellipsis className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className={"w-96"}>
                {currentPost.author?._id === userId ? (
                  <Button
                    className={"text-red-500 cursor-pointer"}
                    variant={"ghost"}
                  >
                    Delete currentPost
                  </Button>
                ) : (
                  <>
                    <Button
                      className={"text-red-500 cursor-pointer"}
                      variant={"ghost"}
                    >
                      Unfollow
                    </Button>
                    <Button
                      className={"text-red-500 cursor-pointer"}
                      variant={"ghost"}
                    >
                      Block
                    </Button>
                  </>
                )}
                <DialogClose className={"cursor-pointer"}>cancel</DialogClose>
              </DialogContent>
            </Dialog>
          </div>

          {/* currentPost caption  */}
          <p className="text-sm border-b mb-2">{currentPost.caption}</p>

          {/* Commentors details */}
          <div className="flex-1 overflow-scroll scrollbar-none pb-12">
            {currentPost.comments?.map((comment) => (
              <div key={comment._id} className="my-2">
                <div className="flex items-center gap-2">
                  <Link to={`/${comment.author.username}`}>
                    <Avatar className={"w-8 h-8"}>
                      <AvatarImage
                        src={
                          comment.author?.profilePicture ||
                          "../assets/default_img.jpg"
                        }
                        className={"object-cover cursor-pointer"}
                      />
                      <AvatarFallback>SS</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex flex-auto items-center">
                    <h2 className="font-medium cursor-pointer mr-2">
                      <Link to={`/${comment.author.username}`}>
                        {comment.author.username}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600">
                      <CalculateTime time={comment.createdAt} />
                    </p>
                  </div>
                  <Dialog>
                    <DialogOverlay className={"bg-black/50"} />
                    <DialogTrigger asChild>
                      <Ellipsis className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className={"w-96"}>
                      {comment.author._id === userId ? (
                        <DialogClose>
                          <Button
                            className={"text-red-500 cursor-pointer w-full"}
                            variant={"ghost"}
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete Comment
                          </Button>
                        </DialogClose>
                      ) : (
                        <>
                          <Button
                            className={"text-red-500 cursor-pointer"}
                            variant={"ghost"}
                          >
                            Unfollow
                          </Button>
                          <Button
                            className={"text-red-500 cursor-pointer"}
                            variant={"ghost"}
                          >
                            Block
                          </Button>
                        </>
                      )}
                      <DialogClose
                        variant={"ghost"}
                        className={"cursor-pointer"}
                      >
                        cancel
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            ))}

            {currentPost.comments?.length === 0 && (
              <p className="text-sm text-gray-600">No comments yet</p>
            )}
          </div>

          {/* Comment Input */}
          <div className="w-full p-2 absolute bottom-0 left-0 bg-white">
            <form
              onSubmit={submitUserComment}
              className="flex w-full justify-between text-sm border rounded-md"
            >
              <input
                type="text"
                placeholder="Add your comment..."
                value={userComment}
                onChange={handleUserComment}
                className="py-1.5 outline-none w-full px-2"
              />
              {userComment.trim() && (
                <button
                  onClick={submitUserComment}
                  className="font-medium text-blue-500 hover:text-blue-600 cursor-pointer p-1.5 text-sm"
                >
                  comment
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentBox;
