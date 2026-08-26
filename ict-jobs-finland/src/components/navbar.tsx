import { Link } from "react-router-dom";

const navigation = [
  { name: "Työpaikat", path: "/jobs" },
  { name: "Junior", path: "/jobs/junior" },
  { name: "AMK-harjoittelu", path: "/jobs/amk-harjoittelu" },
  { name: "Ammattikoulu", path: "/jobs/ammattikoulu-harjoittelu" },
  { name: "Kesätyöt", path: "/jobs/kesatyo" },
  { name: "Trainee", path: "/jobs/trainee" },
];

function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          ICT Jobs Finland
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <Link
          to="/employers"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Yrityksille
        </Link>
      </div>
    </header>
  );
}

export default Navbar;