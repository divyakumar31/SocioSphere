import { HeartIcon, MessageCircleIcon } from "lucide-react";
import React from "react";

const ProfilePostImage = ({ post, userId }) => {
  return (
    <>
      <div
        key={post._id}
        className="relative flex-1 min-w-36 min-h-36 xsm:min-w-60 xsm:min-h-60"
      >
        <img
          src={post.image}
          alt={post.caption}
          className="object-contain bg-white"
        />
        <div className="absolute top-0 w-full h-full bg-black/50 flex items-center justify-center gap-4 opacity-0 hover:opacity-100 text-white">
          <p className="flex gap-2">
            {post.likes?.includes(userId) ? (
              <HeartIcon fill="red" stroke="red" />
            ) : (
              <HeartIcon />
            )}
            {post.likes?.length}
          </p>
          <p className="flex gap-2">
            <MessageCircleIcon /> {post.comments?.length}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfilePostImage;
