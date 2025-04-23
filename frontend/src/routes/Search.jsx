import { searchUserApi } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 700);
  useEffect(() => {
    if (!debouncedQuery) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await searchUserApi(debouncedQuery);
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  return (
    <div className="w-full max-h-screen flex flex-col p-2 xsm:p-4">
      <section role="search">
        <form action="" className="flex">
          <div className="relative w-full max-w-lg mx-auto group">
            <input
              type="text"
              placeholder="Search by username or name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full max-w-lg p-2 pl-8 rounded-xl border outline-none focus-visible:outline-none shadow-lg"
            />

            <SearchIcon
              className="absolute left-2 top-2.5 group-focus-within:text-gray-700 text-gray-400 cursor-pointer"
              size={20}
            />
          </div>
        </form>
      </section>
      <section
        role="search-results"
        className="mt-4 flex-1 w-full max-w-lg mx-auto overflow-scroll scrollbar-none"
      >
        {users.map((user) => (
          <div className="flex items-center gap-2 border-b p-2" key={user._id}>
            <Avatar className={"w-12 h-12"}>
              <AvatarImage
                src={user?.profilePicture || "../assets/default_img.jpg"}
                className={"object-cover cursor-pointer"}
              />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link to={`/${user.username}`} className="text-sm font-medium">
                {user?.username}
              </Link>
              <Link to={`/${user.username}`} className="text-xs text-gray-500">
                {user?.name}
              </Link>
            </div>
          </div>
        ))}
        {loading && (
          <p className="flex items-center gap-2 justify-center">
            <span>
              <Loader2Icon className="animate-spin" />
            </span>{" "}
            Loading...
          </p>
        )}

        <p
          className={`text-center text-sm text-gray-500 opacity-0 transition duration-150 delay-700 ${
            users.length === 0 && !loading && query && "opacity-100"
          }`}
        >
          {users.length === 0 && !loading && query && "No users found"}
        </p>
      </section>
    </div>
  );
};

export default Search;
