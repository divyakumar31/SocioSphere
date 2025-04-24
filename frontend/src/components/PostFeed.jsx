import { getAllPostsApi } from "@/api";
import { addPosts } from "@/features/postSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";

const PostFeed = () => {
  const dispatch = useDispatch();
  const postIds = useSelector((state) => state.post.post.map((p) => p._id));
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPostsApi();
        if (res.data.success) {
          dispatch(addPosts(res.data.data));
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data.message ||
            error?.message ||
            "Check your internet connection"
        );
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col xsm:items-center gap-4 w-full">
        {postIds?.length === 0 && <p>No posts found</p>}
        {postIds?.map((p) => (
          <Post key={p} postId={p} />
        ))}
      </div>
    </>
  );
};

export default PostFeed;
