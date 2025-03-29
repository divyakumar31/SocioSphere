import {
  addCommentApi,
  deleteCommentApi,
  getSinglePostApi,
  likeDislikePostApi,
} from "@/api";
import { CalculateTime, CommentBox } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  addComment,
  dislikePost,
  likePost,
  setComments,
  setCurrentPost,
} from "@/features/postSlice";
import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const SinglePost = () => {
  const { id } = useParams();
  let { currentPost } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const getCurrentPost = async () => {
    try {
      if (currentPost._id !== id) {
        const res = getSinglePostApi(id);
        if (res.data.success) {
          toast.success(res.data.message);
          currentPost = res.data.data;
        }
      } else {
        toast.success("Post already loaded");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };
  useEffect(() => {
    getCurrentPost();
  }, [id]);

  const [liked, setLiked] = useState(currentPost.likes?.includes(user._id));
  const [postLikes, setPostLikes] = useState(currentPost.likes.length);
  const handleLike = async () => {
    try {
      const res = await likeDislikePostApi(liked ? "dislike" : "like", id);
      if (res.data.success) {
        dispatch(
          liked
            ? dislikePost({ postId: id, userId: user._id })
            : likePost({ postId: id, userId: user._id })
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
  const handleBookmark = () => {}; // TODO:
  const bookmarked = true;

  const [userComment, setUserComment] = useState("");

  const handleUserComment = (e) => {
    setUserComment(e.target.value);
  };

  // To add Comment on post
  const submitUserComment = async (e) => {
    e.preventDefault();
    try {
      const res = await addCommentApi(userComment, id);
      if (res.data.success) {
        dispatch(addComment({ postId: id, comment: res.data.data }));
        dispatch(setCurrentPost(id));
        console.log(res.data.data);
        toast.success(res.data.message);
        setUserComment("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteCommentApi(commentId);
      if (res.data.success) {
        const updatedComments = currentPost.comments.filter(
          (comment) => comment._id !== commentId
        );
        dispatch(setComments({ postId: id, comments: updatedComments }));
        dispatch(setCurrentPost(id));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };
  const handleReportComment = () => {}; // TODO:
  const handlePostShare = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_BASE_URL}/p/${id}?shid=${user._id}`
    );
    toast.success("Copied to clipboard");
  };

  const [openCommentDialog, setOpenCommentDialog] = useState(false);

  return (
    <div className="h-screen overflow-scroll scrollbar-none w-full flex justify-center items-center">
      {/* Left */}
      <div className="max-w-96 max-h-10/12 w-full h-full flex flex-col p-4 ">
        <div className="flex items-center gap-2">
          <Link to={`/${currentPost?.author.username}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={currentPost?.author.profilePicture}
                className="object-cover cursor-pointer"
              />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-1 items-center">
            <Link to={`/${currentPost?.author.username}`}>
              <h2 className="text-lg font-medium cursor-pointer">
                {currentPost?.author.username}
              </h2>
            </Link>
            <p className="text-sm text-gray-400 ml-2">
              <CalculateTime time={currentPost?.createdAt} />
            </p>
          </div>
          <Dialog>
            <DialogOverlay className={"bg-black/50"} />
            <DialogTrigger asChild>
              <Ellipsis className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className={"w-96"}>
              {currentPost?.author._id === user._id ? (
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
        <img
          src={currentPost?.image}
          alt={currentPost?.caption}
          className="w-full object-contain flex-1"
        />
        <div className="flex items-center justify-between my-2 w-full">
          <div className="flex items-center gap-2">
            {liked ? (
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
              className="cursor-pointer md:hidden"
              onClick={() => setOpenCommentDialog(true)}
            />
            <Send className="cursor-pointer" onClick={handlePostShare} />
          </div>
          <div>
            {bookmarked ? (
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
        <p className="text-gray-900 ">{currentPost?.caption}</p>
        <p className="font-medium">{postLikes} Likes</p>
        {currentPost?.comments?.length > 0 && (
          <p
            className="text-sm text-gray-400 w-fit cursor-pointer md:hidden block"
            onClick={() => setOpenCommentDialog(true)}
          >
            View all {currentPost?.comments.length} comments
          </p>
        )}
      </div>
      {/* Right */}
      <div className="hidden md:flex max-w-96 max-h-10/12 w-full h-full flex-col p-4 relative">
        {/* Caption */}
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/${currentPost?.author.username}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={currentPost?.author?.profilePicture}
                className="object-cover cursor-pointer"
              />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <h2 className="text-lg font-medium cursor-pointer w-fit">
              <Link to={`/${currentPost?.author.username}`}>
                {currentPost?.author?.username}
              </Link>
            </h2>
            <p className="text-gray-700">{currentPost?.caption}</p>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4 border-t pt-4 pb-12 flex-1 overflow-scroll scrollbar-none">
          {currentPost?.comments?.map((comment) => (
            <div className="flex items-center gap-2" key={comment._id}>
              <Link to={`/${comment?.author.username}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={comment?.author?.profilePicture}
                    className="object-cover cursor-pointer"
                  />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <h2 className="text-lg font-medium cursor-pointer w-fit">
                  <Link to={`/${comment?.author.username}`}>
                    {comment?.author.username}
                  </Link>
                  <span className="text-gray-500 text-sm font-normal ml-2">
                    <CalculateTime time={comment.createdAt} />
                  </span>
                </h2>
                <p className="text-gray-700">{comment.text}</p>
              </div>

              <Dialog>
                <DialogOverlay className={"bg-black/50"} />
                <DialogTrigger asChild>
                  <Ellipsis className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className={"w-96"}>
                  {comment?.author._id === user._id ? (
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
                    <Button
                      className={"text-red-500 cursor-pointer"}
                      variant={"ghost"}
                      onClick={handleReportComment}
                    >
                      Report
                    </Button>
                  )}

                  <DialogClose className={"cursor-pointer"}>cancel</DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          ))}

          {currentPost?.comments?.length === 0 && (
            <p className="text-gray-700">No comments yet</p>
          )}
        </div>

        {/* Comment Input */}
        <div className="w-full p-4 absolute bottom-0 left-0 bg-white">
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

      {/* Mobile */}
      {openCommentDialog && (
        <Dialog open={openCommentDialog}>
          <DialogOverlay className={"bg-black/50"} />
          <DialogContent
            onInteractOutside={() => setOpenCommentDialog(false)}
            className={
              "p-0 overflow-hidden outline-none border-none md:max-w-3xl"
            }
          >
            <CommentBox userId={user._id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SinglePost;
