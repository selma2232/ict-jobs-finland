function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <h2 className="font-bold text-gray-900">
              ICT Jobs Finland
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              ICT-alan työpaikat, junioripaikat ja opiskelijoiden
              harjoittelupaikat yhdessä paikassa.
            </p>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900">
              Tietoa palvelusta
            </a>
            <a href="#" className="hover:text-gray-900">
              Yrityksille
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-400">
          © 2026 ICT Jobs Finland
        </div>
      </div>
    </footer>
  );
}

export default Footer;