import { ProfilePostImage } from "@/components";
import { useSelector } from "react-redux";

const Explore = () => {
  const { post } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.user);
  return (
    <div className="p-2 xsm:p-4 overflow-scroll scrollbar-none h-screen w-full">
      {post.length !== 0 ? (
        <>
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {post?.map((p) => (
              <ProfilePostImage key={p._id} post={p} userId={user._id} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-center place-content-center h-screen">
            No Posts Found
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;
