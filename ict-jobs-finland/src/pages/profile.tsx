import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const availableSkills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PostgreSQL",
  "Git",
  "Docker",
  "Microsoft 365",
  "Windows",
];

const interestOptions = [
  { value: "junior", label: "Junior / Entry-level" },
  { value: "amk", label: "AMK-harjoittelu" },
  { value: "vocational", label: "Ammattikoulun harjoittelu" },
  { value: "summer", label: "Kesätyö" },
  { value: "trainee", label: "Trainee" },
];

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [field, setField] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setError("");

        const response = await fetch(
          "http://localhost:3000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Profiilin lataaminen epäonnistui."
          );
        }

        setName(data.name || "");
        setEducationLevel(data.profile?.educationLevel || "");
        setField(data.profile?.field || "");
        setLocation(data.profile?.location || "");
        setSkills(
          Array.isArray(data.profile?.skills)
            ? data.profile.skills
            : []
        );
        setInterests(
          Array.isArray(data.profile?.interests)
            ? data.profile.interests
            : []
        );
      } catch (error) {
        console.error(error);

        setError(
          "Profiilin lataaminen epäonnistui. Yritä uudelleen."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const toggleSkill = (skill: string) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );

    setError("");
    setSuccess("");
  };

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );

    setSuccess("");
  };

  const validateProfile = () => {
    if (!name.trim()) {
      return "Lisää nimesi.";
    }

    if (!educationLevel) {
      return "Valitse koulutustaso.";
    }

    if (!field.trim()) {
      return "Lisää ala, jota opiskelet tai jolla haluat työskennellä.";
    }

    if (!location.trim()) {
      return "Lisää sijaintisi.";
    }

    if (skills.length === 0) {
      return "Valitse vähintään yksi taito.";
    }

    if (interests.length === 0) {
      return "Valitse vähintään yksi työpaikkatyyppi.";
    }

    return "";
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateProfile();

    if (validationError) {
      setError(validationError);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            educationLevel,
            field: field.trim(),
            location: location.trim(),
            skills,
            interests,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Profiilin tallennus epäonnistui."
        );
      }

      setSuccess("Profiili tallennettu onnistuneesti.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Profiilin tallennus epäonnistui."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-gray-600">
              Ladataan profiilia...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Profiilini
          </h1>

          <p className="mt-3 text-gray-600">
            Kerro osaamisestasi ja kiinnostuksistasi, jotta löydämme
            sinulle sopivampia ICT-työpaikkoja.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <span className="font-bold text-red-600">!</span>

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <span className="font-bold text-green-600">✓</span>

              <p className="text-sm font-medium text-green-700">
                {success}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          {/* PERUSTIEDOT */}

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Perustiedot
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Näitä tietoja käytetään työpaikkojen sopivuuden
              arvioinnissa.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Nimi
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Nimesi"
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="educationLevel"
                  className="text-sm font-semibold text-gray-700"
                >
                  Koulutustaso
                </label>

                <select
                  id="educationLevel"
                  value={educationLevel}
                  onChange={(event) => {
                    setEducationLevel(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                >
                  <option value="">
                    Valitse koulutustaso
                  </option>

                  <option value="amk">AMK</option>
                  <option value="vocational">
                    Ammattikoulu
                  </option>
                  <option value="university">
                    Yliopisto
                  </option>
                  <option value="graduated">
                    Valmistunut
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="field"
                  className="text-sm font-semibold text-gray-700"
                >
                  Ala
                </label>

                <input
                  id="field"
                  type="text"
                  value={field}
                  onChange={(event) => {
                    setField(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Esim. Tieto- ja viestintätekniikka"
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="text-sm font-semibold text-gray-700"
                >
                  Sijainti
                </label>

                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Esim. Helsinki"
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>
          </section>

          {/* OSAAMINEN */}

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Osaaminen
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Valitse teknologiat ja taidot, joita osaat.
                </p>
              </div>

              <span className="text-sm font-medium text-gray-500">
                {skills.length} valittu
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {availableSkills.map((skill) => {
                const selected = skills.includes(skill);

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      selected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {skill}
                  </button>
                );
              })}
            </div>

            {skills.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700">
                  Valitut taidot
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* KIINNOSTUKSET */}

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Millaisia paikkoja etsit?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Valitse työpaikkatyypit, joista olet kiinnostunut.
            </p>

            <div className="mt-5 space-y-3">
              {interestOptions.map((option) => {
                const selected = interests.includes(
                  option.value
                );

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      selected
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleInterest(option.value)
                      }
                      className="h-4 w-4"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* SAVE */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Täytä profiilisi mahdollisimman tarkasti, jotta
              työpaikkojen matchaus toimii paremmin.
            </p>

            <button
              type="submit"
              disabled={saving}
              className={`rounded-lg px-6 py-3 font-semibold text-white transition ${
                saving
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {saving
                ? "Tallennetaan..."
                : "Tallenna profiili"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Profile;