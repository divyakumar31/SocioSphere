import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="h-screen overflow-scroll scrollbar-none">
      <h1>Home</h1>
      <p>{user.username}</p>
    </div>
  );
};

export default Home;
