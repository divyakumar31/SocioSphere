import { PostFeed, SuggestionsBar } from "@/components";

const Home = () => {
  return (
    <div className="h-screen overflow-scroll scrollbar-none flex p-2 xsm:p-4">
      <PostFeed />
      <SuggestionsBar />
    </div>
  );
};

export default Home;
