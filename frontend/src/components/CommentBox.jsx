import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "./ui/dialog";
import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CalculateTime } from ".";
import { addCommentApi, deleteCommentApi } from "@/api";
import { addComment, setComments, setCurrentPost } from "@/features/postSlice";
import toast from "react-hot-toast";

const CommentBox = ({ userId }) => {
  const post = useSelector((state) => state.post.currentPost);
  const [userComment, setUserComment] = useState("");
  const dispatch = useDispatch();
  const [openCommentorOptions, setOpenCommentorOptions] = useState(false);
  const handleUserComment = (e) => {
    setUserComment(e.target.value);
  };

  // To add Comment on post
  const submitUserComment = async (e) => {
    e.preventDefault();
    try {
      const res = await addCommentApi(userComment, post._id);
      if (res.data.success) {
        dispatch(addComment({ postId: post._id, comment: res.data.data }));
        dispatch(setCurrentPost(post._id));
        console.log(res.data.data);
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
        const updatedComments = post.comments.filter(
          (comment) => comment._id !== id
        );
        dispatch(setComments({ postId: post._id, comments: updatedComments }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 p-0 w-full gap-2 overflow-scroll scrollbar-none max-h-96">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full object-contain self-center hidden md:block"
        />
        <div className="p-2 max-h-96 relative flex flex-col">
          {/* Post Author details  */}
          <div className="flex items-center gap-2">
            <Link to={`/${post.author.username}`}>
              <Avatar className={"w-8 h-8"}>
                <AvatarImage
                  src={post.author?.profilePicture || "/assets/default_img.jpg"}
                  className={"object-cover cursor-pointer"}
                />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-auto">
              <h2 className="font-medium cursor-pointer">
                <Link to={`/${post.author.username}`}>
                  {post.author.username}
                </Link>
              </h2>
            </div>
            <Dialog>
              <DialogOverlay className={"bg-black/50"} />
              <DialogTrigger asChild>
                <Ellipsis className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className={"w-96"}>
                {post.author._id === userId ? (
                  <Button
                    className={"text-red-500 cursor-pointer"}
                    variant={"ghost"}
                  >
                    Delete Post
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

          {/* Post caption  */}
          <p className="text-sm border-b mb-2">{post.caption}</p>

          {/* Commentors details */}
          <div className="flex-1 overflow-scroll scrollbar-none pb-12">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="my-2">
                <div className="flex items-center gap-2">
                  <Link to={`/${comment.author.username}`}>
                    <Avatar className={"w-8 h-8"}>
                      <AvatarImage
                        src={
                          comment.author?.profilePicture ||
                          "/assets/default_img.jpg"
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
                  <Dialog onOpenChange={setOpenCommentorOptions}>
                    <DialogOverlay className={"bg-black/50"} />
                    <DialogTrigger asChild>
                      <Ellipsis className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className={"w-96"}>
                      {comment.author._id === userId ? (
                        <DialogClose>
                          <Button
                            className={"text-red-500 cursor-pointer"}
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

            {post.comments?.length === 0 && (
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
