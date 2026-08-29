import { useEffect, useMemo, useState } from "react";
import JobCard from "../components/jobcard";
import type { Job } from "../types/job";
import type { UserProfile } from "../types/profile";
import { calculateJobMatch } from "../utils/jobmatch";

function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [technology, setTechnology] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        /*
         * ----------------------------------------
         * 1. HAETAAN TYÖPAIKAT
         * ----------------------------------------
         */

        const jobsResponse = await fetch(
          "http://localhost:3000/api/jobs"
        );

        if (!jobsResponse.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const jobsData = await jobsResponse.json();

        setJobs(Array.isArray(jobsData) ? jobsData : []);

        /*
         * ----------------------------------------
         * 2. HAETAAN PROFIILI
         * ----------------------------------------
         *
         * Profiilia tarvitaan vain suosituksia varten.
         * Jos käyttäjä ei ole kirjautunut, työpaikat
         * toimivat silti normaalisti.
         */

        if (token) {
          try {
            const profileResponse = await fetch(
              "http://localhost:3000/api/profile",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();

              if (profileData?.profile) {
                setProfile(profileData.profile);
              }
            }
          } catch (profileError) {
            console.error(
              "Profiilin lataaminen epäonnistui:",
              profileError
            );
          }
        }
      } catch (error) {
        console.error(error);
        setError("Työpaikkojen lataaminen epäonnistui.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /*
   * ----------------------------------------
   * 3. SUODATETAAN TYÖPAIKAT
   * ----------------------------------------
   */

  const filteredJobs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return jobs.filter((job) => {
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
    jobs,
  ]);

  /*
   * ----------------------------------------
   * 4. HENKILÖKOHTAISET SUOSITUKSET
   * ----------------------------------------
   *
   * Jokaiselle työpaikalle lasketaan match-score.
   * Sen jälkeen parhaat työpaikat järjestetään
   * korkeimman pistemäärän mukaan.
   */

  const recommendedJobs = useMemo(() => {
    if (!profile) {
      return [];
    }

    return [...filteredJobs]
      .map((job) => ({
        job,
        score: calculateJobMatch(job, profile).score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [filteredJobs, profile]);

  /*
   * ----------------------------------------
   * 5. MUUT TYÖPAIKAT
   * ----------------------------------------
   *
   * Poistetaan suositellut työpaikat alemmasta
   * listasta, jotta sama työ ei näy kahdesti.
   */

  const recommendedJobIds = useMemo(
    () => new Set(recommendedJobs.map((item) => item.job.id)),
    [recommendedJobs]
  );

  const otherJobs = useMemo(() => {
    if (!profile) {
      return filteredJobs;
    }

    return filteredJobs.filter(
      (job) => !recommendedJobIds.has(job.id)
    );
  }, [filteredJobs, profile, recommendedJobIds]);

  /*
   * ----------------------------------------
   * 6. SUODATTIMIEN NOLLAUS
   * ----------------------------------------
   */

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setWorkMode("");
    setJobType("");
    setExperienceLevel("");
    setTechnology("");
  };

  /*
   * ----------------------------------------
   * 7. LOADING
   * ----------------------------------------
   */

  if (loading) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-gray-600">
            Ladataan työpaikkoja...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------
   * 8. ERROR
   * ----------------------------------------
   */

  if (error) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------
   * 9. UI
   * ----------------------------------------
   */

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Page header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            ICT-työpaikat
          </h1>

          <p className="mt-3 text-gray-600">
            Löydä ICT-alan työpaikkoja, juniorirooleja ja
            harjoittelupaikkoja.
          </p>
        </div>

        {/* Filters */}
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Haku
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="React, Python, IT-tuki..."
              className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">

            {/* Location */}
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

            {/* Work mode */}
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
                <option value="On-site">
                  Paikan päällä
                </option>
              </select>
            </div>

            {/* Job type */}
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
                <option value="Full-time">
                  Vakituinen
                </option>
                <option value="Part-time">
                  Osa-aikainen
                </option>
                <option value="Internship">
                  AMK-harjoittelu
                </option>
                <option value="Summer">
                  Kesätyö
                </option>
                <option value="Trainee">
                  Trainee
                </option>
              </select>
            </div>

            {/* Experience */}
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
                <option value="Internship">
                  Harjoittelu
                </option>
                <option value="Junior">Junior</option>
                <option value="Entry-level">
                  Entry-level
                </option>
                <option value="Mid">
                  Mid-level
                </option>
                <option value="Senior">
                  Senior
                </option>
              </select>
            </div>

            {/* Technology */}
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

        {/* Result count */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            {filteredJobs.length} työpaikkaa löytyi
          </p>
        </div>

        {/* ----------------------------------------
            PERSONAL RECOMMENDATIONS
            ---------------------------------------- */}

        {profile && recommendedJobs.length > 0 && (
          <section className="mt-8">
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  Suositellut sinulle
                </h2>

                <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                  Profiilisi perusteella
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Nämä työpaikat sopivat parhaiten profiilisi
                osaamiseen, kiinnostuksiin, koulutukseen ja
                sijaintiin.
              </p>
            </div>

            <div className="space-y-4">
              {recommendedJobs.map(
                ({ job, score }) => (
                  <div key={job.id} className="relative">
                    {/* Match badge */}
                    <div className="absolute right-4 top-4 z-10 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
                      {score}% sopivuus
                    </div>

                    <JobCard job={job} />
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* ----------------------------------------
            ALL OTHER JOBS
            ---------------------------------------- */}

        <section className="mt-10">
          {profile && recommendedJobs.length > 0 && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Muut työpaikat
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Lisää työpaikkoja löydettäväksi.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {otherJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>

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
                className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Tyhjennä suodattimet
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Jobs;