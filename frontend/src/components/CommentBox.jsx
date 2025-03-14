import React from "react";
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
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CalculateTime } from ".";

const CommentBox = ({ userId }) => {
  const post = useSelector((state) => state.post.currentPost);

  return (
    <>
      <div className="grid grid-cols-2 p-0 w-full gap-2">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full object-contain self-center"
        />
        <div className="p-2 max-h-96 overflow-scroll scrollbar-none">
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
          <p className="text-sm border-b mb-4">{post.caption}</p>

          {/* Commentors details */}
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
                <Dialog>
                  <DialogOverlay className={"bg-black/50"} />
                  <DialogTrigger asChild>
                    <Ellipsis className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className={"w-96"}>
                    {comment.author._id === userId ? (
                      <Button
                        className={"text-red-500 cursor-pointer"}
                        variant={"ghost"}
                      >
                        Delete Comment
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
                    <DialogClose className={"cursor-pointer"}>
                      cancel
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommentBox;
