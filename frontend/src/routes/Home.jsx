import { logoutUserApi } from "@/api";
import { logoutUser } from "@/features/userSlice";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await logoutUserApi();
      console.log(res.data.message);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(logoutUser());

        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data.message || "Check your internet connection"
      );
    }
  };
  return (
    <div>
      <h1>Home</h1>
      <p>{user.username}</p>
      <p
        onClick={handleLogout}
        className="cursor-pointer bg-blue-500 text-white px-2 py-1 hover:bg-blue-600"
      >
        Logout
      </p>
    </div>
  );
};

export default Home;
