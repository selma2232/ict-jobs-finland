import { useMemo, useState } from "react";
import JobCard from "../components/jobcard";
import { mockJobs } from "../data/mockJobs";


function Jobs() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [technology, setTechnology] = useState("");

  const filteredJobs = useMemo(() => {
    const searchTerm = search.toLowerCase();

    return mockJobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.technologies.some((item) =>
          item.toLowerCase().includes(searchTerm)
        );

      const matchesLocation =
        !location || job.location === location;

      const matchesWorkMode =
        !workMode || job.workMode === workMode;

      const matchesJobType =
        !jobType || job.jobType === jobType;

      const matchesExperience =
        !experienceLevel ||
        job.experienceLevel === experienceLevel;

      const matchesTechnology =
        !technology ||
        job.technologies.includes(technology);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesWorkMode &&
        matchesJobType &&
        matchesExperience &&
        matchesTechnology
      );
    });
  }, [
    search,
    location,
    workMode,
    jobType,
    experienceLevel,
    technology,
  ]);

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setWorkMode("");
    setJobType("");
    setExperienceLevel("");
    setTechnology("");
  };

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            ICT-työpaikat
          </h1>

          <p className="mt-3 text-gray-600">
            Löydä ICT-alan työpaikkoja, juniorirooleja ja
            harjoittelupaikkoja.
          </p>
        </div>

        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Haku
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="React, Python, IT-tuki..."
              className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Sijainti
              </label>

              <select
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3"
              >
                <option value="">Kaikki sijainnit</option>
                <option value="Helsinki">Helsinki</option>
                <option value="Espoo">Espoo</option>
                <option value="Vantaa">Vantaa</option>
                <option value="Tampere">Tampere</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Työmuoto
              </label>

              <select
                value={workMode}
                onChange={(event) =>
                  setWorkMode(event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3"
              >
                <option value="">Kaikki</option>
                <option value="Remote">Etätyö</option>
                <option value="Hybrid">Hybridi</option>
                <option value="On-site">Paikan päällä</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Työpaikan tyyppi
              </label>

              <select
                value={jobType}
                onChange={(event) =>
                  setJobType(event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3"
              >
                <option value="">Kaikki</option>
                <option value="full-time">Vakituinen</option>
                <option value="part-time">Osa-aikainen</option>
                <option value="internship-amk">
                  AMK-harjoittelu
                </option>
                <option value="internship-vocational">
                  Ammattikoulun harjoittelu
                </option>
                <option value="summer">Kesätyö</option>
                <option value="trainee">Trainee</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Kokemustaso
              </label>

              <select
                value={experienceLevel}
                onChange={(event) =>
                  setExperienceLevel(event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3"
              >
                <option value="">Kaikki</option>
                <option value="internship">Harjoittelu</option>
                <option value="junior">Junior</option>
                <option value="entry-level">
                  Entry-level
                </option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Teknologia
              </label>

              <select
                value={technology}
                onChange={(event) =>
                  setTechnology(event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3"
              >
                <option value="">Kaikki</option>
                <option value="React">React</option>
                <option value="TypeScript">
                  TypeScript
                </option>
                <option value="Node.js">Node.js</option>
                <option value="Python">Python</option>
                <option value="PostgreSQL">
                  PostgreSQL
                </option>
                <option value="Microsoft 365">
                  Microsoft 365
                </option>
                <option value="Windows">Windows</option>
                <option value="Git">Git</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Tyhjennä suodattimet
            </button>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            {filteredJobs.length} työpaikkaa löytyi
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
                Kokeile muuttaa hakuehtoja.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Tyhjennä suodattimet
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Jobs;