import { getAllPostsApi } from "@/api";
import { addAllPosts } from "@/features/postSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";

const PostFeed = ({ ...props }) => {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const storePost = useSelector((state) => state.post.post);

  useEffect(() => {
    setPosts(storePost);
  }, [storePost]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPostsApi();
        if (res.data.success) {
          setPosts(res.data.data);
          dispatch(addAllPosts(res.data.data));
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
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

export default PostFeed;
