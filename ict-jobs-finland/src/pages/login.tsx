import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("Käyttäjää ei löytynyt. Luo ensin tili.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.email !== email || user.password !== password) {
      setError("Sähköposti tai salasana on väärin.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");

    navigate("/profile");
  };

  return (
    <main className="bg-gray-50">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-12">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Kirjaudu sisään
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Kirjaudu käyttääksesi profiilia ja tallennettuja työpaikkoja.
          </p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Sähköposti
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
                placeholder="sinä@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Salasana
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Kirjaudu
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Eikö sinulla ole tiliä?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Luo tili
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;