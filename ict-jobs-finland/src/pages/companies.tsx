import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../api";

type Company = {
  id: string;
  name: string;
  description: string;
  location: string;
  website?: string | null;
  _count: {
    jobs: number;
  };
};

function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/companies`);

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error(error);
        setError("Yritysten lataaminen epäonnistui.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900">
          Yritykset
        </h1>

        <p className="mt-4 text-gray-600">
          Ladataan yrityksiä...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900">
          Yritykset
        </h1>

        <p className="mt-4 text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Yritykset
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Tutustu ICT-alan työnantajiin ja niiden avoimiin työpaikkoihin.
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Yrityksiä ei löytynyt
            </h2>

            <p className="mt-2 text-gray-600">
              Yrityksiä ei ole tällä hetkellä saatavilla.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <article
                key={company.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-gray-700">
                    {company.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-gray-900">
                      {company.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      📍 {company.location}
                    </p>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  {company.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-sm font-medium text-gray-600">
                    {company._count.jobs}{" "}
                    {company._count.jobs === 1
                      ? "avoin työpaikka"
                      : "avointa työpaikkaa"}
                  </span>

                  <Link
                    to={`/companies/${company.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Katso yritys →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Companies;