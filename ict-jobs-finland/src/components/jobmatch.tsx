import type { Job } from "../types/job";
import type { UserProfile } from "../types/profile";
import { calculateJobMatch } from "../utils/jobmatch";

interface JobMatchProps {
  job: Job;
  profile: UserProfile;
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Erinomainen match";
  if (score >= 80) return "Erittäin hyvä match";
  if (score >= 70) return "Hyvä match";
  if (score >= 60) return "Kohtalainen match";
  return "Heikompi match";
}

function getScoreDescription(score: number) {
  if (score >= 90) {
    return "Profiilisi vastaa erittäin hyvin tämän työpaikan vaatimuksia.";
  }

  if (score >= 80) {
    return "Profiilisi sopii tähän työpaikkaan erittäin hyvin.";
  }

  if (score >= 70) {
    return "Sinulla on hyvä pohja tähän tehtävään.";
  }

  if (score >= 60) {
    return "Työpaikka voi sopia sinulle, mutta muutamia asioita kannattaa kehittää.";
  }

  return "Työpaikka ei vastaa täysin profiiliasi, mutta voit silti hyötyä mahdollisuudesta.";
}

function JobMatch({ job, profile }: JobMatchProps) {
  const result = calculateJobMatch(job, profile);

  const score = result.score;

  const scoreColor =
    score >= 80
      ? "text-green-600"
      : score >= 60
        ? "text-yellow-600"
        : "text-gray-500";

  const scoreBorder =
    score >= 80
      ? "border-green-500"
      : score >= 60
        ? "border-yellow-500"
        : "border-gray-300";

  const progressColor =
    score >= 80
      ? "bg-green-500"
      : score >= 60
        ? "bg-yellow-500"
        : "bg-gray-400";

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-6 text-white md:px-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Premium Match
            </span>
          </div>

          <h2 className="text-2xl font-bold">
            Kuinka hyvin tämä työ sopii sinulle?
          </h2>

          <p className="text-sm text-gray-300">
            Arvio perustuu profiilisi osaamiseen, koulutukseen,
            sijaintiin ja työpaikan vaatimuksiin.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Main score */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Kokonaisosuma
            </p>

            <div className="mt-1 flex items-baseline gap-3">
              <span
                className={`text-5xl font-bold tracking-tight ${scoreColor}`}
              >
                {score}%
              </span>

              <span className="text-lg font-semibold text-gray-900">
                {getScoreLabel(score)}
              </span>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
              {getScoreDescription(score)}
            </p>
          </div>

          {/* Score circle */}
          <div
            className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[6px] ${scoreBorder}`}
          >
            <span className={`text-xl font-bold ${scoreColor}`}>
              {score}%
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Matched skills */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Osaamisen match
            </h3>

            <span className="text-sm text-gray-500">
              {result.matchedSkills.length}/
              {job.technologies.length} teknologiaa
            </span>
          </div>

          {result.matchedSkills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              Profiilistasi ei löytynyt suoraan vastaavia teknologioita.
            </p>
          )}
        </div>

        {/* Missing skills */}
        {result.missingSkills.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900">
              Kehitettävät taidot
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Näiden teknologioiden osaaminen voisi parantaa
              mahdollisuuksiasi tässä tehtävässä.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {result.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600"
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reasons */}
        {result.reasons.length > 0 && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="font-semibold text-gray-900">
              Miksi tämä työ sopii sinulle?
            </h3>

            <ul className="mt-4 space-y-3">
              {result.reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex gap-3 text-sm leading-6 text-gray-600"
                >
                  <span className="mt-0.5 text-green-600">
                    ✓
                  </span>

                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <h3 className="font-semibold text-gray-900">
              Huomioitavaa
            </h3>

            <ul className="mt-4 space-y-3">
              {result.warnings.map((warning) => (
                <li
                  key={warning}
                  className="flex gap-3 text-sm leading-6 text-gray-700"
                >
                  <span className="mt-0.5 font-bold text-yellow-600">
                    !
                  </span>

                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Profile summary */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900">
            Match perustuu profiiliisi
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Koulutus
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {profile.educationLevel || "Ei määritelty"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Ala
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {profile.field || "Ei määritelty"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Sijainti
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {profile.location || "Ei määritelty"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobMatch;