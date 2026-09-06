import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../api";
import JobMatch from "../components/jobmatch";
import type { UserProfile } from "../types/profile";
import type { Job } from "../types/job";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  /*
   * ----------------------------------------
   * LADATAAN TYÖPAIKKA
   * ----------------------------------------
   */

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError("Työpaikkaa ei löytynyt.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/jobs/${id}`
        );

        if (!response.ok) {
          throw new Error("Job not found");
        }

        const data: Job = await response.json();

        setJob(data);
      } catch (error) {
        console.error(error);
        setError("Työpaikan lataaminen epäonnistui.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  /*
   * ----------------------------------------
   * LADATAAN KÄYTTÄJÄN PROFIILI
   * ----------------------------------------
   */

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setProfileLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Profile could not be loaded");
        }

        const data = await response.json();

        const userProfile: UserProfile = {
          name: data.name || "",
          educationLevel:
            data.profile?.educationLevel || "",
          field: data.profile?.field || "",
          location: data.profile?.location || "",
          skills: Array.isArray(data.profile?.skills)
            ? data.profile.skills
            : [],
          interests: Array.isArray(data.profile?.interests)
            ? data.profile.interests
            : [],
        };

        setProfile(userProfile);
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /*
   * ----------------------------------------
   * TARKISTETAAN TALLENNETTU TYÖPAIKKA
   * ----------------------------------------
   */

  useEffect(() => {
    const checkSaved = async () => {
      const token = localStorage.getItem("token");

      if (!token || !id) {
        setSaved(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/saved-jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          setSaved(false);
          return;
        }

        const savedJobs = await response.json();

        const alreadySaved = Array.isArray(savedJobs)
          ? savedJobs.some(
              (savedJob: { jobId?: string }) =>
                savedJob.jobId === id
            )
          : false;

        setSaved(alreadySaved);
      } catch (error) {
        console.error(
          "Failed to check saved job:",
          error
        );

        setSaved(false);
      }
    };

    checkSaved();
  }, [id]);

  /*
   * ----------------------------------------
   * TALLENNA / POISTA TALLENNUS
   * ----------------------------------------
   */

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Kirjaudu sisään tallentaaksesi työpaikan."
      );
      return;
    }

    if (!id) {
      return;
    }

    setSaving(true);

    try {
      if (saved) {
        const response = await fetch(
          `${API_URL}/api/saved-jobs/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response
            .json()
            .catch(() => null);

          throw new Error(
            data?.message ||
              "Failed to remove saved job"
          );
        }

        setSaved(false);
      } else {
        const response = await fetch(
          `${API_URL}/api/saved-jobs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              jobId: id,
            }),
          }
        );

        if (!response.ok) {
          const data = await response
            .json()
            .catch(() => null);

          throw new Error(
            data?.message ||
              "Failed to save job"
          );
        }

        setSaved(true);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Työpaikan tallentaminen epäonnistui."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ----------------------------------------
   * LOADING
   * ----------------------------------------
   */

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-6 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-10 w-3/4 rounded bg-gray-200" />
          <div className="h-5 w-1/3 rounded bg-gray-200" />
          <div className="h-32 rounded-xl bg-gray-200" />
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------
   * ERROR
   * ----------------------------------------
   */

  if (error || !job) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-6 py-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Työpaikkaa ei löytynyt
          </h1>

          <p className="mt-3 text-gray-600">
            Tätä työpaikkailmoitusta ei ole olemassa
            tai se on poistettu.
          </p>

          <Link
            to="/jobs"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Takaisin työpaikkoihin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Back */}
        <Link
          to="/jobs"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Takaisin työpaikkoihin
        </Link>

        {/* Job header */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="p-8 md:p-10">
            <div className="flex flex-col justify-between gap-8 md:flex-row">

              {/* Job information */}
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  {job.experienceLevel?.toLowerCase() ===
                    "junior" && (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      Junior
                    </span>
                  )}

                  {job.jobType?.toLowerCase() ===
                    "trainee" && (
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      Trainee
                    </span>
                  )}

                  {job.jobType?.toLowerCase() ===
                    "summer" && (
                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Kesätyö
                    </span>
                  )}

                  {job.jobType?.toLowerCase() ===
                    "internship" && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Harjoittelu
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
                  {job.title}
                </h1>

                <Link
                  to={`/companies/${job.companyId}`}
                  className="mt-2 block text-xl font-medium text-gray-700 transition hover:text-blue-600"
                >
                  {job.company?.name}
                </Link>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    📍 {job.location}
                  </span>

                  <span>
                    💼 {job.workMode}
                  </span>

                  {job.salary && (
                    <span>
                      💰 {job.salary}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0">
                <div className="flex flex-col gap-3">

                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-gray-900 px-8 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
                  >
                    Hae työpaikkaa →
                  </a>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className={`rounded-lg border px-8 py-3 font-semibold transition ${
                      saved
                        ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } ${
                      saving
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    {saving
                      ? "Tallennetaan..."
                      : saved
                        ? "♥ Tallennettu"
                        : "♡ Tallenna työpaikka"}
                  </button>
                </div>
              </div>

            </div>

            {/* Technologies */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900">
                Teknologiat
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.technologies.map(
                  (technology: string) => (
                    <span
                      key={technology}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700"
                    >
                      {technology}
                    </span>
                  )
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ---------------------------------- */}
        {/* PREMIUM MATCH */}
        {/* ---------------------------------- */}

        <div className="mt-10">

          {profileLoading ? (
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-white">
                <div className="animate-pulse">
                  <div className="h-5 w-32 rounded bg-white/20" />
                  <div className="mt-3 h-7 w-72 rounded bg-white/20" />
                  <div className="mt-2 h-4 w-96 max-w-full rounded bg-white/20" />
                </div>
              </div>

              <div className="p-8">
                <p className="text-sm text-gray-500">
                  Lasketaan Premium Match -tulosta...
                </p>
              </div>
            </section>

          ) : profile ? (

            <JobMatch
              job={job}
              profile={profile}
            />

          ) : (

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-6 text-white md:px-8">

                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Premium Match
                </span>

                <h2 className="mt-3 text-2xl font-bold">
                  Löydä sinulle sopivimmat työpaikat
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
                  Premium Match vertaa työpaikkaa
                  profiilisi osaamiseen, kiinnostuksiin,
                  koulutukseen ja sijaintiin.
                </p>

              </div>

              <div className="p-6 md:p-8">

                <div className="grid gap-4 sm:grid-cols-3">

                  <div className="rounded-xl bg-gray-50 p-5">
                    <div className="text-2xl">
                      🎯
                    </div>

                    <h3 className="mt-3 font-semibold text-gray-900">
                      Osaaminen
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Vertaa teknologioita ja taitojasi
                      työpaikan vaatimuksiin.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <div className="text-2xl">
                      🎓
                    </div>

                    <h3 className="mt-3 font-semibold text-gray-900">
                      Koulutus
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Arvioi koulutuksesi sopivuutta
                      tehtävään.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <div className="text-2xl">
                      ⭐
                    </div>

                    <h3 className="mt-3 font-semibold text-gray-900">
                      Kiinnostukset
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Etsi yhteyksiä kiinnostustesi ja
                      työtehtävän välillä.
                    </p>
                  </div>

                </div>

                <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">
                    Luo oma Premium Match
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Kirjaudu sisään ja täytä profiilisi,
                    jotta saat henkilökohtaisen
                    sopivuusprosentin jokaisesta
                    työpaikasta.
                  </p>

                  <Link
                    to="/login"
                    className="mt-4 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Kirjaudu sisään
                  </Link>
                </div>

              </div>
            </section>
          )}

        </div>

        {/* Job description */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">

          <h2 className="text-xl font-bold text-gray-900">
            Tietoa tehtävästä
          </h2>

          <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
            {job.description}
          </p>

        </div>

        {/* Job information */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">

          <h2 className="text-xl font-bold text-gray-900">
            Työpaikan tiedot
          </h2>

          <dl className="mt-5 grid gap-5 sm:grid-cols-2">

            <div>
              <dt className="text-sm text-gray-500">
                Yritys
              </dt>

              <dd className="mt-1 font-medium text-gray-900">
                {job.company?.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Sijainti
              </dt>

              <dd className="mt-1 font-medium text-gray-900">
                {job.location}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Työmuoto
              </dt>

              <dd className="mt-1 font-medium text-gray-900">
                {job.workMode}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Kokemustaso
              </dt>

              <dd className="mt-1 font-medium capitalize text-gray-900">
                {job.experienceLevel}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Työtyyppi
              </dt>

              <dd className="mt-1 font-medium text-gray-900">
                {job.jobType}
              </dd>
            </div>

          </dl>

        </div>

      </div>
    </main>
  );
}

export default JobDetails;