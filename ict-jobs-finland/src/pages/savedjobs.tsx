import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../components/jobcard";
import type { Job } from "../types/job";

interface SavedJobResponse {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
  job: Job;
}

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Kirjaudu sisään nähdäksesi tallennetut työpaikat.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/saved-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch saved jobs"
          );
        }

        setSavedJobs(data);
      } catch (error) {
        console.error(error);
        setError("Tallennettujen työpaikkojen lataaminen epäonnistui.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-5xl px-6 py-20">
        <p className="text-gray-600">
          Ladataan tallennettuja työpaikkoja...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">{error}</p>

            <Link
              to="/login"
              className="mt-4 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Kirjaudu sisään
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
            {savedJobs.map((savedJob) => (
              <JobCard
                key={savedJob.id}
                job={savedJob.job}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Et ole tallentanut vielä työpaikkoja
            </h2>

            <p className="mt-3 text-gray-500">
              Kun löydät kiinnostavan työpaikan, voit tallentaa
              sen myöhempää tarkastelua varten.
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