import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="text-center place-content-center h-screen space-y-2 p-4">
        <h1 className="text-4xl font-bold">404 Page Not Found</h1>
        <p className="text-lg text-gray-600">
          The page you're looking for is not available or does not exist.
        </p>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 font-medium hover:text-blue-600 cursor-pointer"
          >
            ← Go back
          </button>
          <Link
            to={"/"}
            // onClick={() => navigate("/")}
            className="text-blue-500 font-medium hover:text-blue-600 cursor-pointer"
          >
            Go Home →
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
