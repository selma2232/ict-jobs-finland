import { useMemo, useState } from "react";
import JobCard from "../components/jobcard";
import { mockJobs } from "../data/mockJobs";
import type { JobType, ExperienceLevel } from "../types/job";

interface JobListPageProps {
  title: string;
  description: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
}

function JobListPage({
  title,
  description,
  jobType,
  experienceLevel,
}: JobListPageProps) {
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const searchTerm = search.toLowerCase();

    return mockJobs.filter((job) => {
      const matchesCategory =
        (!jobType || job.jobType === jobType) &&
        (!experienceLevel || job.experienceLevel === experienceLevel);

      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm) ||
        job.companyId.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.technologies.some((technology) =>
          technology.toLowerCase().includes(searchTerm)
        );

      return matchesCategory && matchesSearch;
    });
  }, [search, jobType, experienceLevel]);

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            {description}
          </p>
        </div>

        <div className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Hae työpaikkaa, yritystä tai teknologiaa..."
            className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 outline-none transition focus:border-gray-500"
          />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            {filteredJobs.length} työpaikkaa
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

          {filteredJobs.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Työpaikkoja ei löytynyt
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Kokeile toista hakusanaa.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default JobListPage;