import { registerUserApi } from "@/api";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../features/userSlice.js";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.username.length < 3) {
      toast.error("Enter valid username");
    } else if (user.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
    } else if (
      !/^[a-zA-Z]+[a-zA-Z0-9._]*[a-zA-Z0-9]+@gmail.com$/.test(user.email)
    ) {
      toast.error("Please enter a valid email");
    } else {
      setIsLoading(true);
      try {
        const res = await registerUserApi(user);
        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(addUser(res.data.data));
          setUser({
            username: "",
            email: "",
            password: "",
          });
          navigate("/");
        }
      } catch (error) {
        toast.error(
          error.response?.data.message || "Check your internet connection"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to="/">
          <img
            alt="Socio Sphere"
            src="../assets/SocioSphere-dark-logo.png"
            className="mx-auto h-10 w-auto select-none"
          />
        </Link>
        <h2 className="mt-6 text-center text-2xl/9 font-semibold tracking-tight text-gray-900">
          Create New Account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="yourname"
                value={user.username}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={user.email}
                onChange={handleChange}
                placeholder="youremail@gmail.com"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={user.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? (
                <div className="flex gap-2">
                  <Loader2Icon className="animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
