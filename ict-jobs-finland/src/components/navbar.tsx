import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
];

function Navbar() {
  const navigate = useNavigate();

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

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link
          to="/"
          className="shrink-0 text-xl font-bold text-gray-900"
        >
          ICT Jobs Finland
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              {item.name}
            </Link>
          ))}

          {isLoggedIn && (
            <>
              <Link
                to="/profile"
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                Profiili
              </Link>

              <Link
                to="/saved-jobs"
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                Tallennetut
              </Link>
            </>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/employers"
            className="hidden rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 sm:block"
          >
            Yrityksille
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {userName && (
                <span className="hidden text-sm font-medium text-gray-700 lg:block">
                  Hei, {userName}
                </span>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-semibold text-gray-700 transition hover:text-red-600"
              >
                Kirjaudu ulos
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-700 transition hover:text-gray-900"
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