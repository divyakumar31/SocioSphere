import { getAllPostsApi } from "@/api";
import { addPosts } from "@/features/postSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";

const PostFeed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.post);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPostsApi();
        if (res.data.success) {
          dispatch(addPosts(res.data.data));
          // toast.success(res.data.message);
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
        {posts?.length === 0 && <p>No posts found</p>}
        {posts?.map((p) => (
          <Post key={p._id} postId={p._id} />
        ))}
      </div>
    </>
  );
};

export default PostFeed;
