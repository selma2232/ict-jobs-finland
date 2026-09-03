# ICT Jobs Finland

## 🇫🇮 Projektista / 🇬🇧 About the Project

**FI:**  
ICT Jobs Finland on full-stack-verkkosovellus, jonka tarkoituksena on auttaa käyttäjiä löytämään ICT-alan työpaikkoja Suomessa omien taitojen, koulutuksen, kiinnostuksen kohteiden ja uratavoitteiden perusteella.

**EN:**  
ICT Jobs Finland is a full-stack web application designed to help users find ICT jobs in Finland based on their skills, education, interests and career goals.

> **FI:** Tila: MVP aktiivisessa kehityksessä  
> **EN:** Status: MVP in active development

---

## 🎯 Tavoite / Goal

**FI:**  
Projektin tavoitteena on rakentaa oikean verkkopalvelun kaltainen työpaikka-alusta, joka ei ainoastaan listaa työpaikkoja vaan auttaa käyttäjää löytämään juuri hänelle sopivia mahdollisuuksia.

**EN:**  
The goal of the project is to build a realistic job platform that does more than simply list jobs. It helps users discover opportunities that are relevant to their individual profile.

---

## ✨ Ominaisuudet / Features

### 🔐 Käyttäjätilit ja autentikointi / User Accounts & Authentication

**FI:**
- Käyttäjätilin luominen
- Kirjautuminen
- JWT-pohjainen autentikointi
- Suojatut sivut ja API-reitit
- Käyttäjän omien tietojen hakeminen
- Salasanojen suojaaminen bcryptillä

**EN:**
- User registration
- Login
- JWT-based authentication
- Protected pages and API routes
- Retrieving authenticated user data
- Password hashing with bcrypt

---

### 👤 Profiili / Profile

**FI:**  
Käyttäjä voi luoda ja muokata omaa ammatillista profiiliaan.

Profiili sisältää:
- Nimen
- Koulutustason
- Koulutusalan
- Sijainnin
- Taidot ja teknologiat
- Kiinnostuksen kohteet

Profiilin tiedot validoidaan sekä frontendissä että backendissä.

**EN:**  
Users can create and edit their professional profile.

The profile includes:
- Name
- Education level
- Field of study
- Location
- Skills and technologies
- Career interests

Profile data is validated on both the frontend and backend.

---

### 💼 Työpaikkojen haku / Job Search

**FI:**  
Käyttäjä voi hakea ja suodattaa ICT-alan työpaikkoja esimerkiksi seuraavien tietojen perusteella:

- Hakusana
- Sijainti
- Työskentelytapa
- Työsuhdetyyppi
- Kokemustaso
- Teknologia

**EN:**  
Users can search and filter ICT job listings based on:

- Search term
- Location
- Work mode
- Job type
- Experience level
- Technology

---

### 🔖 Tallennetut työpaikat / Saved Jobs

**FI:**  
Käyttäjä voi tallentaa kiinnostavia työpaikkoja ja tarkastella niitä myöhemmin.

**EN:**  
Users can save interesting job listings and access them later from their saved jobs page.

---

### 📄 Työpaikan tiedot / Job Details

**FI:**  
Jokaisella työpaikalla on oma sivunsa, jossa voidaan näyttää esimerkiksi:

- Työtehtävän nimi
- Yritys
- Sijainti
- Työskentelytapa
- Työsuhdetyyppi
- Kokemustaso
- Työpaikkakuvaus
- Teknologiat
- Yrityksen tiedot

**EN:**  
Each job has its own detailed page containing information such as:

- Job title
- Company
- Location
- Work mode
- Job type
- Experience level
- Job description
- Technologies
- Company information

---

### 🎯 Job Match

**FI:**  
Sovellus arvioi, kuinka hyvin työpaikka sopii käyttäjän profiiliin.

Matchissa huomioidaan esimerkiksi:

- Taidot
- Sijainti
- Koulutus ja kokemustaso
- Kiinnostuksen kohteet

Järjestelmä voi näyttää:
- Match-pistemäärän
- Yhteensopivat taidot
- Puuttuvat taidot
- Yhteensopivat kiinnostuksen kohteet
- Perusteluita yhteensopivuudelle

**EN:**  
The application calculates how well a job matches the user's profile.

The matching system considers:

- Skills
- Location
- Education and experience level
- Career interests

The system can provide:
- Match score
- Matching skills
- Missing skills
- Matching interests
- Reasons for the match

---

### ⭐ Henkilökohtaiset suositukset / Personalized Recommendations

**FI:**  
Sovellus pystyy suosittelemaan työpaikkoja käyttäjän profiilin perusteella.

Suosituksissa voidaan huomioida:
- Taidot
- Sijainti
- Koulutus
- Kiinnostuksen kohteet
- Työpaikkatoiveet

**EN:**  
The application can recommend jobs based on the user's profile.

Recommendations can take into account:
- Skills
- Location
- Education
- Interests
- Job preferences

---

### 🏢 Yritykset / Companies

**FI:**  
Käyttäjä voi tutustua yrityksen omaan sivuun ja nähdä sen perustiedot sekä avoimet työpaikat.

Nykyinen yrityssivu sisältää:
- Yrityksen nimen
- Sijainnin
- Kuvauksen
- Verkkosivuston
- Avoimet työpaikat

Yritysjärjestelmää tullaan laajentamaan seuraavassa kehitysvaiheessa.

**EN:**  
Users can explore individual company pages and view company information and open positions.

The current company page includes:
- Company name
- Location
- Description
- Website
- Open jobs

The company system will be expanded in the next development stage.

---

## 🛠️ Teknologiat / Technology Stack

### Frontend

**FI:** React, TypeScript, React Router ja Tailwind CSS

**EN:** React, TypeScript, React Router and Tailwind CSS

### Backend

**FI:** Node.js, Express ja TypeScript

**EN:** Node.js, Express and TypeScript

### Tietokanta / Database

**FI:** PostgreSQL ja Prisma ORM

**EN:** PostgreSQL and Prisma ORM

### Autentikointi / Authentication

**FI:** JSON Web Tokens (JWT) ja bcryptjs

**EN:** JSON Web Tokens (JWT) and bcryptjs

---

## 📁 Projektin rakenne / Project Structure

```text
ICT-Jobs-Finland/
│
├── src/
│   ├── components/
│   │   ├── JobCard
│   │   ├── JobMatch
│   │   ├── Navbar
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Home
│   │   ├── Jobs
│   │   ├── JobDetails
│   │   ├── CompanyDetails
│   │   ├── Profile
│   │   ├── SavedJobs
│   │   ├── Login
│   │   └── Register
│   │
│   ├── utils/
│   │   └── jobmatch
│   │
│   ├── types/
│   │
│   └── App
│
├── backend/
│   └── src/
│       ├── routes/
│       │   ├── auth
│       │   ├── profile
│       │   ├── jobs
│       │   └── companies
│       │
│       └── ...
│
├── prisma/
│   └── schema.prisma
│
├── package.json
├── README.md
└── ...
