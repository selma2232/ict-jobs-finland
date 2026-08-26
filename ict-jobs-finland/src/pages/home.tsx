import { Link } from "react-router-dom";

const categories = [
  {
    title: "Junior & Entry-level",
    description: "Löydä ensimmäinen ICT-alan työpaikkasi.",
    path: "/jobs/junior",
  },
  {
    title: "AMK-harjoittelu",
    description: "ICT-alan harjoittelupaikat AMK-opiskelijoille.",
    path: "/jobs/amk-harjoittelu",
  },
  {
    title: "Ammattikoulun harjoittelu",
    description: "Työharjoittelupaikat ICT-alan opiskelijoille.",
    path: "/jobs/ammattikoulu-harjoittelu",
  },
  {
    title: "Kesätyöt",
    description: "ICT-alan kesätyöt opiskelijoille ja junioreille.",
    path: "/jobs/kesatyo",
  },
];

function Home() {
  return (
    <main>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
              ICT Jobs Finland
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
              Löydä seuraava ICT-työsi.
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Suomen ICT-alan työpaikat, junioriroolit ja opiskelijoiden
              harjoittelupaikat yhdessä paikassa.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Esim. React, Python, IT-tuki..."
                className="h-12 flex-1 rounded-lg border border-gray-300 bg-white px-4 outline-none focus:border-gray-500"
              />

              <input
                type="text"
                placeholder="Sijainti"
                className="h-12 rounded-lg border border-gray-300 bg-white px-4 outline-none focus:border-gray-500 sm:w-48"
              />

              <Link
                to="/jobs"
                className="flex h-12 items-center justify-center rounded-lg bg-gray-900 px-6 font-semibold text-white hover:bg-gray-800"
              >
                Hae työpaikkoja
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Löydä sinulle sopiva paikka
          </h2>

          <p className="mt-2 text-gray-600">
            Etsitkö ensimmäistä työpaikkaasi tai harjoittelupaikkaa?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="rounded-xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-gray-900">
                {category.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {category.description}
              </p>

              <span className="mt-6 inline-block text-sm font-semibold text-blue-600">
                Katso paikat →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;