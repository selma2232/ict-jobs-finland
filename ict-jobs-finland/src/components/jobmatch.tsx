import type { Job } from "../types/job";
import type { UserProfile } from "../types/profile";
import { calculateJobMatch } from "../utils/jobmatch";

interface JobMatchProps {
  job: Job;
  profile: UserProfile;
}

function JobMatch({ job, profile }: JobMatchProps) {
  const result = calculateJobMatch(job, profile);

  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            Sopivuus profiilisi kanssa
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {result.score} %
          </p>
        </div>

        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${
            result.score >= 80
              ? "border-green-500 text-green-600"
              : result.score >= 60
                ? "border-yellow-500 text-yellow-600"
                : "border-gray-300 text-gray-500"
          }`}
        >
          <span className="text-lg font-bold">
            {result.score}%
          </span>
        </div>
      </div>

      {result.matchedSkills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900">
            ✓ Osaamisesi sopii
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">
            {result.matchedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.missingSkills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900">
            Kehitettävää
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">
            {result.missingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.reasons.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900">
            Miksi tämä työpaikka sopii?
          </h3>

          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {result.reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default JobMatch;