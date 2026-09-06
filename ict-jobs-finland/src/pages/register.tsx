import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Rekisteröityminen epäonnistui."
        );
        return;
      }

      // Rekisteröinti onnistui.
      // Kirjaudutaan seuraavaksi sisään login-sivulla.
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(
        "Palvelimeen ei saatu yhteyttä. Varmista, että backend on käynnissä."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-12">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Luo tili
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Luo profiili löytääksesi sinulle sopivampia ICT-paikkoja.
          </p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Nimi
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Luodaan tiliä..." : "Luo tili"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Onko sinulla jo tili?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Kirjaudu sisään
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;