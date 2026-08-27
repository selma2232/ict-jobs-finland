import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Jobs from "./pages/jobs";
import JobListPage from "./pages/joblistpage";
import CompanyDetails from "./pages/companydetails";
import Profile from "./pages/profile";
import SavedJobs from "./pages/savedjobs";

import Login from "./pages/login";
import Register from "./pages/register";
function Placeholder({ title }: { title: string }) {
  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
      <p className="mt-4 text-gray-600">
        Tämä sivu rakennetaan seuraavassa vaiheessa.
      </p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/jobs" element={<Jobs />} />

           <Route
  path="/jobs/junior"
  element={
    <JobListPage
      title="Junior & Entry-level"
      description="ICT-alan junior- ja entry-level työpaikat urasi alkuun."
      experienceLevel="junior"
    />
  }
/>

            <Route
  path="/jobs/amk-harjoittelu"
  element={
    <JobListPage
      title="AMK-harjoittelu"
      description="ICT-alan harjoittelupaikat ammattikorkeakouluopiskelijoille."
      jobType="internship-amk"
    />
  }
/>

           <Route
  path="/jobs/ammattikoulu-harjoittelu"
  element={
    <JobListPage
      title="Ammattikoulun työharjoittelu"
      description="ICT-alan työssäoppimis- ja harjoittelupaikat ammattikouluopiskelijoille."
      jobType="internship-vocational"
    />
  }
/>

           <Route
  path="/jobs/kesatyo"
  element={
    <JobListPage
      title="ICT-kesätyöt"
      description="ICT-alan kesätyöt opiskelijoille ja uransa alkuvaiheessa oleville."
      jobType="summer"
    />
  }
/>

            <Route
  path="/jobs/trainee"
  element={
    <JobListPage
      title="Trainee-paikat"
      description="Trainee- ja uransa alkuvaiheen ohjelmat ICT-alalla."
      jobType="trainee"
    />
  }
/>

            <Route
              path="/employers"
              element={<Placeholder title="Yrityksille" />}
            />

            <Route
              path="/about"
              element={<Placeholder title="Tietoa palvelusta" />}
            />
            <Route
  path="/companies/:id"
  element={<CompanyDetails />}
/>
<Route path="/profile" element={<Profile />} />
<Route path="/saved-jobs" element={<SavedJobs />} />
<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;