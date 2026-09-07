import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../api";
import { calculateJobMatch } from "../utils/jobmatch";
import type { Job } from "../types/job";
import type { UserProfile } from "../types/profile";

type DashboardProfile = UserProfile & {
  name?: string;
};

type SavedJob = {
  id: string;
  job: Job;
};

type Company = {
  id: string;
  name: string;
  location: string;
  _count?: {
    jobs: number;
  };
};

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [profileResponse, jobsResponse, savedJobsResponse, companiesResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/profile`, {
              headers,
            }),
            fetch(`${API_URL}/api/jobs`),
            fetch(`${API_URL}/api/saved-jobs`, {
              headers,
            }),
            fetch(`${API_URL}/api/companies`),
          ]);

        if (!profileResponse.ok) {
          throw new Error("Profiilin lataaminen epäonnistui.");
        }

        if (!jobsResponse.ok) {
          throw new Error("Työpaikkojen lataaminen epäonnistui.");
        }

        if (!savedJobsResponse.ok) {
          throw new Error("Tallennettujen työpaikkojen lataaminen epäonnistui.");
        }

        if (!companiesResponse.ok) {
          throw new Error("Yritysten lataaminen epäonnistui.");
        }

        const profileData = await profileResponse.json();
        const jobsData = await jobsResponse.json();
        const savedJobsData = await savedJobsResponse.json();
        const companiesData = await companiesResponse.json();

        setProfile(profileData);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setSavedJobs(Array.isArray(savedJobsData) ? savedJobsData : []);
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
      } catch (error) {
        console.error(error);

        if (
          error instanceof Error &&
          error.message
        ) {
          setError(error.message);
        } else {
          setError("Dashboardin lataaminen epäonnistui.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const profileCompletion = useMemo(() => {
    if (!profile) {
      return 0;
    }

    const checks = [
      Boolean(profile.name?.trim()),
      Boolean(profile.educationLevel?.trim()),
      Boolean(profile.field?.trim()),
      Boolean(profile.location?.trim()),
      Array.isArray(profile.skills) && profile.skills.length > 0,
      Array.isArray(profile.interests) && profile.interests.length > 0,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [profile]);

  const recommendedJobs = useMemo(() => {
    if (!profile || jobs.length === 0) {
      return [];
    }

    return jobs
      .map((job) => ({
        job,
        match: calculateJobMatch(job, profile),
      }))
      .filter(({ match }) => match.score > 0)
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 3);
  }, [jobs, profile]);

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-4 text-gray-600">
          Ladataan dashboardia...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-4 text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Hei, {profile?.name || "siellä"} 👋
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Löydä sinulle sopivia ICT-alan työpaikkoja.
          </p>
        </section>

        {/* Quick stats */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Profile */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Profiilisi
              </h2>

              <span className="text-2xl font-bold text-blue-600">
                {profileCompletion}%
              </span>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />
            </div>

            <p className="mt-4 text-sm text-gray-600">
              {profileCompletion === 100
                ? "Profiilisi on valmis."
                : "Täydennä profiiliasi saadaksesi parempia suosituksia."}
            </p>

            <Link
              to="/profile"
              className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Muokkaa profiilia →
            </Link>
          </div>

          {/* Saved jobs */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Tallennetut työpaikat
            </h2>

            <p className="mt-4 text-4xl font-bold text-gray-900">
              {savedJobs.length}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              {savedJobs.length === 1
                ? "tallennettu työpaikka"
                : "tallennettua työpaikkaa"}
            </p>

            <Link
              to="/saved-jobs"
              className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Katso tallennetut →
            </Link>
          </div>

          {/* Companies */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Yritykset
            </h2>

            <p className="mt-4 text-4xl font-bold text-gray-900">
              {companies.length}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              ICT-alan työnantajaa
            </p>

            <Link
              to="/companies"
              className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Selaa yrityksiä →
            </Link>
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Sinulle suositellut työpaikat
              </h2>

              <p className="mt-2 text-gray-600">
                Suositukset perustuvat profiiliisi ja työpaikkojen sopivuuteen.
              </p>
            </div>

            <Link
              to="/jobs"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Katso kaikki työpaikat →
            </Link>
          </div>

          {recommendedJobs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="text-lg font-bold text-gray-900">
                Täydennä profiiliasi
              </h3>

              <p className="mt-2 text-gray-600">
                Lisää osaamisesi, koulutuksesi, sijaintisi ja
                kiinnostuksen kohteesi, jotta voimme näyttää
                henkilökohtaisia suosituksia.
              </p>

              <Link
                to="/profile"
                className="mt-5 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Täydennä profiilia
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {recommendedJobs.map(({ job, match }) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-sm font-medium text-gray-600">
                        {job.company?.name || "Yritys"}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-blue-50 px-3 py-2 text-center">
                      <p className="text-xl font-bold text-blue-600">
                        {match.score}%
                      </p>

                      <p className="text-xs font-medium text-blue-700">
                        sopivuus
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-gray-600">
                    <p>📍 {job.location}</p>
                    <p>💼 {job.workMode}</p>
                  </div>

                  {match.matchedSkills.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Osuvat taidot
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {match.matchedSkills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/jobs/${job.id}`}
                    className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Katso työpaikka →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;