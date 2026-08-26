import { Link, useParams } from "react-router-dom";
import { mockJobs } from "../data/mockJobs";
import { mockCompanies } from "../data/mockcompanies";

function JobDetails() {
  const { id } = useParams();

  const job = mockJobs.find((item) => item.id === id);
  const company = mockCompanies.find((item) => item.id === job?.companyId);

  if (!job) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-6 py-20">
        <h1 className="text-3xl font-bold text-gray-900">
          Työpaikkaa ei löytynyt
        </h1>

        <p className="mt-3 text-gray-600">
          Tätä työpaikkailmoitusta ei ole olemassa tai se on poistettu.
        </p>

        <Link
          to="/jobs"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Takaisin työpaikkoihin
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          to="/jobs"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Takaisin työpaikkoihin
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {job.title}
              </h1>

              <Link
                to={`/companies/${job.companyId}`}
                className="text-xl font-medium text-gray-700 hover:text-blue-600"
              >
                {company?.name}
              </Link>


              <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📍 {job.location}</span>
                <span>💼 {job.workMode}</span>

                {job.salary && <span>💰 {job.salary}</span>}
              </div>
            </div>

            <div>
              <button
                type="button"
                className="w-full rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white transition hover:bg-gray-800 md:w-auto"
              >
                Hae työpaikkaa
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Teknologiat
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Tietoa tehtävästä
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {job.description}
            </p>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Työpaikan tiedot
            </h2>

            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">Yritys</dt>
                <dd className="mt-1 font-medium text-gray-900">
                  {company?.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">Sijainti</dt>
                <dd className="mt-1 font-medium text-gray-900">
                  {job.location}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">Työmuoto</dt>
                <dd className="mt-1 font-medium text-gray-900">
                  {job.workMode}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">Kokemustaso</dt>
                <dd className="mt-1 font-medium capitalize text-gray-900">
                  {job.experienceLevel}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}

export default JobDetails;