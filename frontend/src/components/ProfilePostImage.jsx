import { likeDislikePostApi } from "@/api";
import { dislikePost, likePost, setCurrentPost } from "@/features/postSlice";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfilePostImage = ({ post, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likes?.includes(userId));
  const [postLikes, setPostLikes] = useState(post.likes.length);
  const handleLikeDislike = async (e) => {
    e.stopPropagation();
    try {
      const res = await likeDislikePostApi(
        liked ? "dislike" : "like",
        post._id
      );
      if (res.data.success) {
        dispatch(
          liked
            ? dislikePost({ postId: post._id, userId: userId })
            : likePost({ postId: post._id, userId: userId })
        );
        setPostLikes(liked ? postLikes - 1 : postLikes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data.message || "Check your internet connection"
      );
    }
  };

  const handlePostClick = (e) => {
    e.stopPropagation();
    dispatch(setCurrentPost(post));
    navigate(`/p/${post._id}`);
  };
  return (
    <>
      <div
        key={post._id}
        className="relative flex-1 min-h-40"
        onClick={handlePostClick}
      >
        <div className="w-full h-full">
          <img
            src={post.image}
            alt={post.caption}
            className="object-contain min-h-40 bg-white border h-full mx-auto"
          />
        </div>
        <div
          className="absolute top-0 w-full h-full bg-black/50 flex flex-wrap items-center justify-center gap-2 xsm:gap-4 opacity-0 hover:opacity-100 text-white"
          onClick={handlePostClick}
        >
          <p className="flex gap-2">
            {liked ? (
              <HeartIcon
                fill="red"
                stroke="red"
                className="cursor-pointer"
                onClick={(e) => handleLikeDislike(e)}
              />
            ) : (
              <HeartIcon
                className="cursor-pointer"
                onClick={(e) => handleLikeDislike(e)}
              />
            )}
            {postLikes}
          </p>
          <p className="flex gap-2">
            <MessageCircleIcon className="cursor-pointer" />{" "}
            {post.comments?.length}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfilePostImage;
