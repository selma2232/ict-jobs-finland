import { Link } from "react-router-dom";
import JobCard from "../components/jobcard";
import { mockJobs } from "../data/mockJobs";

function SavedJobs() {
  const savedJobIds = JSON.parse(
    localStorage.getItem("savedJobs") || "[]"
  ) as string[];

  const savedJobs = mockJobs.filter((job) =>
    savedJobIds.includes(job.id)
  );

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Tallennetut työpaikat
          </h1>

          <p className="mt-3 text-gray-600">
            Löydät täältä tallentamasi työpaikat.
          </p>
        </div>

        {savedJobs.length > 0 ? (
          <div className="mt-8 space-y-4">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Et ole tallentanut vielä työpaikkoja
            </h2>

            <p className="mt-3 text-gray-500">
              Kun löydät kiinnostavan työpaikan, voit tallentaa sen
              myöhempää tarkastelua varten.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Etsi työpaikkoja
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default SavedJobs;