import { Link, useParams } from "react-router-dom";
import { mockCompanies } from "../data/mockcompanies";
import { mockJobs } from "../data/mockJobs";
import JobCard from "../components/jobcard";

function CompanyDetails() {
  const { id } = useParams();

  const company = mockCompanies.find(
    (item) => item.id === id
  );

  if (!company) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-5xl px-6 py-20">
        <h1 className="text-3xl font-bold text-gray-900">
          Yritystä ei löytynyt
        </h1>

        <p className="mt-3 text-gray-600">
          Tätä yritystä ei löytynyt.
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

  const companyJobs = mockJobs.filter(
    (job) => job.companyId === company.id
  );

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          to="/jobs"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Takaisin työpaikkoihin
        </Link>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold text-gray-700">
              {company.name.charAt(0)}
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {company.name}
              </h1>

              <p className="mt-3 text-gray-500">
                📍 {company.location}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Yrityksestä
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {company.description}
            </p>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
              >
                Yrityksen verkkosivusto →
              </a>
            )}
          </div>
        </section>

        <section className="mt-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Avoimet työpaikat
            </h2>

            <p className="mt-2 text-gray-600">
              {companyJobs.length} avointa paikkaa
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {companyJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {companyJobs.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8">
                <p className="text-gray-600">
                  Yrityksellä ei ole tällä hetkellä avoimia
                  työpaikkoja.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default CompanyDetails;