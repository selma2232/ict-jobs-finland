import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Job } from "../types/job";
import type { UserProfile } from "../types/profile";
import { calculateJobMatch } from "../utils/jobmatch";

interface JobCardProps {
  job: Job;
  profile?: UserProfile | null;
}

function JobCard({ job, profile }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const matchResult = profile
    ? calculateJobMatch(job, profile)
    : null;

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!token) {
        setIsSaved(false);
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

        if (!response.ok) {
          return;
        }

        const savedJobs = await response.json();

        if (!Array.isArray(savedJobs)) {
          return;
        }

        const alreadySaved = savedJobs.some(
          (savedJob: { jobId: string }) =>
            savedJob.jobId === job.id
        );

        setIsSaved(alreadySaved);
      } catch (error) {
        console.error("Failed to check saved job:", error);
      }
    };

    checkIfSaved();
  }, [job.id, token]);

  const handleSave = async () => {
    if (!token) {
      alert("Kirjaudu sisään tallentaaksesi työpaikan.");
      return;
    }

    setSaving(true);

    try {
      if (isSaved) {
        const response = await fetch(
          `http://localhost:3000/api/saved-jobs/${job.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(
            data?.message || "Failed to remove saved job"
          );
        }

        setIsSaved(false);
      } else {
        const response = await fetch(
          "http://localhost:3000/api/saved-jobs",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              jobId: job.id,
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(
            data?.message || "Failed to save job"
          );
        }

        setIsSaved(true);
      }
    } catch (error) {
      console.error(error);
      alert("Työpaikan tallentaminen epäonnistui.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-md">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {job.title}
            </h2>

            {job.experienceLevel === "Junior" && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Junior
              </span>
            )}

            {job.jobType === "Summer" && (
              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                Kesätyö
              </span>
            )}

            {job.jobType === "Trainee" && (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                Trainee
              </span>
            )}
          </div>

          <Link
            to={`/companies/${job.companyId}`}
            className="mt-2 block font-medium text-gray-700 hover:text-blue-600"
          >
            {job.company?.name}
          </Link>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            <span>📍 {job.location}</span>
            <span>💼 {job.workMode}</span>
          </div>

          {matchResult && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
              <span className="text-sm font-semibold text-green-700">
                {matchResult.score} % sopivuus
              </span>
              <span className="text-xs text-green-600">
                profiiliisi
              </span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {job.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                {technology}
              </span>
            ))}
          </div>

          {job.salary && (
            <p className="mt-4 text-sm font-semibold text-gray-900">
              💰 {job.salary}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 md:items-end md:justify-center">
          <Link
            to={`/jobs/${job.id}`}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Katso työpaikka
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${
              isSaved
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
            } ${
              saving
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            {saving
              ? "Tallennetaan..."
              : isSaved
                ? "♥ Poista tallennus"
                : "♡ Tallenna"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default JobCard;