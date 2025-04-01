import { WifiOffIcon } from "lucide-react";
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
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import {
  EditProfile,
  Explore,
  Home,
  Layout,
  Login,
  NotFound,
  Profile,
  ProtectedRoute,
  Search,
  Signup,
  SinglePost,
} from "./routes";

const App = () => {
  const { user } = useSelector((state) => state.user);

  const isOnline = useOnlineStatus();
  return (
    <>
      {isOnline ? (
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* All routes with same layout */}
              <Route index element={<ProtectedRoute children={<Home />} />} />

              {/* Search user */}
              <Route
                path="search"
                element={<ProtectedRoute children={<Search />} />}
              />

              {/* Explore Tab */}
              <Route
                path="explore"
                element={<ProtectedRoute children={<Explore />} />}
              />

              {/* Explore Single Post */}
              <Route
                path="p/:id"
                element={<ProtectedRoute children={<SinglePost />} />}
              />

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

            {/* Chat Routes */}
            <Route
              path="/inbox/"
              element={<ProtectedRoute children={<Layout />} />}
            >
              <Route path=":id" element={<ProtectedRoute children={"Hey"} />} />
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
