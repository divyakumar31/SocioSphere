import { WifiOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ScrollToTop } from "./components";
import { Dialog, DialogContent } from "./components/ui/dialog";
import {
  EditProfile,
  Home,
  Layout,
  Login,
  NotFound,
  Profile,
  ProtectedRoute,
  Signup,
} from "./routes";

const App = () => {
  const { user } = useSelector((state) => state.user);

  const [isOnline, setIsOnline] = useState(true);
  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("load", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("load", updateNetworkStatus);
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, [navigator.onLine]);
  return (
    <>
      {isOnline ? (
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* All routes with same layout */}
              <Route index element={<ProtectedRoute children={<Home />} />} />

              {/* Edit Profile */}
              <Route
                path="e/profile"
                element={<ProtectedRoute children={<EditProfile />} />}
              />

              {/* Any User Profile */}
              <Route
                path=":username"
                element={<ProtectedRoute children={<Profile />} />}
              />
            </Route>

            {/* Login Signup Routes */}
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/" /> : <Signup />}
            />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      ) : (
        <>
          <Dialog open={open}>
            <DialogContent>
              <div className="flex flex-col items-center justify-center">
                <WifiOffIcon className="w-20 h-20" />
                <p className="text-center text-2xl">
                  It seems like you are offline
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default App;
