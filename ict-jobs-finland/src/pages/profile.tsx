import { useState } from "react";

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
  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [field, setField] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log({
      name,
      educationLevel,
      field,
      location,
      skills,
      interests,
    });

    alert("Profiili tallennettu!");
  };

  return (
    <main className="bg-gray-50">
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Perustiedot
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Nimi
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nimesi"
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Koulutustaso
                </label>

                <select
                  value={educationLevel}
                  onChange={(event) =>
                    setEducationLevel(event.target.value)
                  }
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3"
                >
                  <option value="">Valitse koulutustaso</option>
                  <option value="amk">AMK</option>
                  <option value="vocational">Ammattikoulu</option>
                  <option value="university">Yliopisto</option>
                  <option value="graduated">Valmistunut</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Ala
                </label>

                <input
                  type="text"
                  value={field}
                  onChange={(event) => setField(event.target.value)}
                  placeholder="Esim. Tieto- ja viestintätekniikka"
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Sijainti
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Esim. Helsinki"
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-gray-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Osaaminen
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Valitse teknologiat ja taidot, joita osaat.
            </p>

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
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
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

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Millaisia paikkoja etsit?
            </h2>

            <div className="mt-5 space-y-3">
              {interestOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(option.value)}
                    onChange={() => toggleInterest(option.value)}
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Tallenna profiili
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Profile;