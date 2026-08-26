import { Link } from "react-router-dom";
import type { Job } from "../types/job";
import { mockCompanies } from "../data/mockcompanies";
interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
    const company = mockCompanies.find(
  (item) => item.id === job.companyId
);
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-md">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {job.title}
            </h2>

            {job.experienceLevel === "junior" && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Junior
              </span>
            )}

            {job.jobType === "internship-amk" && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                AMK-harjoittelu
              </span>
            )}

            {job.jobType === "internship-vocational" && (
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                Ammattikoulun harjoittelu
              </span>
            )}

            {job.jobType === "summer" && (
              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                Kesätyö
              </span>
            )}

            {job.jobType === "trainee" && (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                Trainee
              </span>
            )}
          </div>

          <Link
  to={`/companies/${job.companyId}`}
  className="mt-2 block font-medium text-gray-700 hover:text-blue-600"
>
  {company?.name}
</Link>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            <span>📍 {job.location}</span>
            <span>💼 {job.workMode}</span>
          </div>

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

        <div className="flex shrink-0 items-end md:items-center">
          <Link
            to={`/jobs/${job.id}`}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Katso työpaikka
          </Link>
        </div>
      </div>
    </article>
  );
}

export default JobCard;