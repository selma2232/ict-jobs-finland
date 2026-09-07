import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navigation = [
  { name: "Työpaikat", path: "/jobs" },
  { name: "Junior", path: "/jobs/junior" },
  { name: "AMK-harjoittelu", path: "/jobs/amk-harjoittelu" },
  {
    name: "Ammattikoulu",
    path: "/jobs/ammattikoulu-harjoittelu",
  },
  { name: "Kesätyöt", path: "/jobs/kesatyo" },
  { name: "Trainee", path: "/jobs/trainee" },
  { name: "Yritykset", path: "/companies" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const updateAuthState = () => {
      const loggedIn =
        localStorage.getItem("isLoggedIn") === "true";

      setIsLoggedIn(loggedIn);

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserName(user?.name || "");
        } catch {
          setUserName("");
        }
      } else {
        setUserName("");
      }
    };

    updateAuthState();

    window.addEventListener("authChanged", updateAuthState);
    window.addEventListener("storage", updateAuthState);

    return () => {
      window.removeEventListener(
        "authChanged",
        updateAuthState
      );

      window.removeEventListener(
        "storage",
        updateAuthState
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    setIsLoggedIn(false);
    setUserName("");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-7 px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 whitespace-nowrap text-xl font-bold tracking-tight text-gray-900"
        >
          ICT Jobs Finland
        </Link>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(item.path)
                  ? "text-gray-950"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {isLoggedIn && (
            <>
              <div className="mx-2 h-6 w-px bg-gray-200" />

              <Link
                to="/dashboard"
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive("/dashboard")
                    ? "bg-gray-100 text-gray-950"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive("/profile")
                    ? "bg-gray-100 text-gray-950"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                Profiili
              </Link>

              <Link
                to="/saved-jobs"
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive("/saved-jobs")
                    ? "bg-gray-100 text-gray-950"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                Tallennetut
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-4">
          <Link
            to="/employers"
            className="hidden whitespace-nowrap rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 sm:block"
          >
            Yrityksille
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {userName && (
                <span className="hidden whitespace-nowrap text-sm text-gray-500 lg:block">
                  Hei,{" "}
                  <span className="font-medium text-gray-700">
                    {userName}
                  </span>
                </span>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-red-600"
              >
                Kirjaudu ulos
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="whitespace-nowrap text-sm font-semibold text-gray-700 transition hover:text-gray-900"
            >
              Kirjaudu
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;