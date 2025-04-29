import {
  addCommentApi,
  deletePostApi,
  likeDislikePostApi,
  savePostApi,
} from "@/api";
import {
  deletePost,
  dislikePost,
  likePost,
  setComments,
  setCurrentPost,
} from "@/features/postSlice";
import { addUser } from "@/features/userSlice";
import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CalculateTime } from ".";
import CommentBox from "./CommentBox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "./ui/dialog";

const Post = React.memo(({ postId }) => {
  const { user } = useSelector((state) => state.user);
  const post = useSelector((state) =>
    state.post.post.find((p) => p._id === postId)
  );
  const dispatch = useDispatch();
  const postState = {
    liked: post.likes?.includes(user._id) || false,
    postLikes: post.likes?.length || 0,
    postComments: post.comments?.length || 0,
    bookmarked: user.savedPosts?.includes(post._id) || false,
  };
  const [commentSection, setCommentSection] = useState(false);
  const [userComment, setUserComment] = useState("");

  // To like and dislike post
  const handleLike = async () => {
    try {
      const res = await likeDislikePostApi(
        postState.liked ? "dislike" : "like",
        post._id
      );
      if (res.data.success) {
        dispatch(
          postState.liked
            ? dislikePost({ postId: post._id, userId: user._id })
            : likePost({ postId: post._id, userId: user._id })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data.message || "Check your internet connection"
      );
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await savePostApi(post._id);
      if (res.data.success) {
        let updatedUser;
        if (postState.bookmarked) {
          updatedUser = {
            ...user,
            savedPosts: user.savedPosts.filter((id) => id !== post._id),
          };
        } else {
          updatedUser = {
            ...user,
            savedPosts: [post._id, ...user.savedPosts],
          };
        }
        dispatch(addUser(updatedUser));
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data.message || "Check your internet connection"
      );
    }
  };
  const handleUserComment = (e) => {
    setUserComment(e.target.value);
  };

  // To add Comment on post
  const submitUserComment = async (e) => {
    e.preventDefault();
    try {
      const res = await addCommentApi(userComment, post._id);
      if (res.data.success) {
        setUserComment("");
        const updatedComments = [res.data.data, ...post.comments];
        dispatch(setComments({ postId: post._id, comments: updatedComments }));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  // To delete post
  const handleDeletePost = async (postId) => {
    try {
      const res = await deletePostApi(postId);
      if (res.data.success) {
        dispatch(deletePost(postId));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  const handlePostShare = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_BASE_URL}/p/${post._id}?shid=${user._id}`
    );
    toast.success("Copied to clipboard");
  };
  return (
    <>
      <div className="max-w-lg w-full border-b border-b-gray-500 mb-2">
        {/* Profile Details */}
        <div className="flex items-center gap-2 w-full">
          <Link to={`/${post?.author?.username}`}>
            <Avatar className={"w-12 h-12"}>
              <AvatarImage
                src={
                  post?.author?.profilePicture || "../assets/default_img.jpg"
                }
                className={"object-cover cursor-pointer"}
              />
              <AvatarFallback className={"cursor-pointer"}>SS</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-auto items-center">
            <h2 className="font-semibold cursor-pointer mr-2">
              <Link to={`/${post?.author?.username}`}>
                {post?.author?.username}
              </Link>
            </h2>
            <p className="text-gray-400 text-sm">
              <CalculateTime time={post?.createdAt} />
            </p>
          </div>
          <Dialog>
            <DialogOverlay className={"bg-black/50"} />
            <DialogTrigger asChild>
              <Ellipsis className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className={"w-96"}>
              {post?.author?._id === user._id ? (
                <Button
                  className={"text-red-500 cursor-pointer"}
                  variant={"ghost"}
                  onClick={() => handleDeletePost(post._id)}
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

        {/* Post Image Details */}
        <img
          src={post?.image}
          alt={post?.caption}
          onDoubleClick={handleLike}
          className="object-cover aspect-square mt-4 w-full"
        />
        {/* <Skeleton className="w-full aspect-square" /> */}

        {/* Post Interaction */}
        <div className="flex items-center justify-between my-2 w-full">
          <div className="flex items-center gap-2">
            {postState.liked ? (
              <Heart
                fill="red"
                stroke="red"
                className="cursor-pointer"
                onClick={handleLike}
              />
            ) : (
              <Heart className="cursor-pointer" onClick={handleLike} />
            )}
            <MessageCircle
              className="cursor-pointer"
              onClick={() => {
                dispatch(setCurrentPost(post));
                setCommentSection(true);
              }}
            />
            <Send className="cursor-pointer" onClick={handlePostShare} />
          </div>
          <div>
            {postState.bookmarked ? (
              <Bookmark
                fill="black"
                className="cursor-pointer"
                onClick={handleBookmark}
              />
            ) : (
              <Bookmark className="cursor-pointer" onClick={handleBookmark} />
            )}
          </div>
        </div>
        <p className="text-gray-900 ">{post?.caption}</p>
        <p className="font-medium">{postState.postLikes} Likes</p>

        {/* Add comment */}
        <div
          className="text-sm text-gray-400 w-fit cursor-pointer"
          onClick={() => {
            dispatch(setCurrentPost(post));
            setCommentSection(true);
          }}
        >
          {postState.postComments
            ? `View all ${postState.postComments} comments`
            : ""}
        </div>
        <div className="w-full">
          <form
            onSubmit={submitUserComment}
            className="flex w-full justify-between text-sm"
          >
            <input
              type="text"
              placeholder="Add your comment..."
              value={userComment}
              onChange={handleUserComment}
              className="py-1.5 outline-none w-full"
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
        {/* Comment Dialog */}
        <Dialog open={commentSection}>
          <DialogOverlay className={"bg-black/50"} />
          <DialogContent
            onInteractOutside={() => setCommentSection(false)}
            className={
              "p-0 overflow-hidden outline-none border-none md:max-w-3xl"
            }
          >
            <CommentBox userId={user._id} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
});

export default Post;
