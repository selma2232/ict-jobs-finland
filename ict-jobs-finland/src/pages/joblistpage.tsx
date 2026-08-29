import { useEffect, useMemo, useState } from "react";
import JobCard from "../components/jobcard";
import type { Job, JobType, ExperienceLevel } from "../types/job";
import type { UserProfile } from "../types/profile";

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Hae työpaikat
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/jobs"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
        setError("Työpaikkojen lataaminen epäonnistui.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Hae kirjautuneen käyttäjän profiili
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setProfileLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          setProfileLoading(false);
          return;
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
        console.error("Failed to load profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const filteredJobs = useMemo(() => {
    const searchTerm = search.toLowerCase();

    return jobs.filter((job) => {
      const matchesCategory =
        (!jobType || job.jobType === jobType) &&
        (!experienceLevel ||
          job.experienceLevel === experienceLevel);

      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.company?.name
          ?.toLowerCase()
          .includes(searchTerm) ||
        job.technologies.some((technology) =>
          technology.toLowerCase().includes(searchTerm)
        );

      return matchesCategory && matchesSearch;
    });
  }, [jobs, search, jobType, experienceLevel]);

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

  if (error) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

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
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Hae työpaikkaa, yritystä tai teknologiaa..."
            className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 outline-none transition focus:border-gray-500"
          />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            {filteredJobs.length} työpaikkaa
          </p>

          {profile && !profileLoading && (
            <p className="text-sm font-medium text-green-700">
              ✓ Henkilökohtainen sopivuus käytössä
            </p>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              profile={profile}
            />
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