import React from "react";
import { useLang, useLocaleLink } from "../lib/lang";

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1 text-sm text-neutral-200">
    {children}
  </span>
);

const Section = ({ title, children }) => (
  <section className="bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-xl p-6 md:p-8">
    <h3 className="text-xl md:text-2xl font-semibold text-neutral-100 mb-4">{title}</h3>
    {children}
  </section>
);

export default function CV() {
  // IMPORTANT (GitHub Pages) : utilise BASE_URL pour référencer le PDF dans /public/
  const { t, lang } = useLang();
  const link = useLocaleLink();
  const pdfHref =
    lang === "en"
      ? `${import.meta.env.BASE_URL}assets/CV_Florian_Glay_EN.pdf`
      : `${import.meta.env.BASE_URL}assets/CV_Florian_Glay_FR.pdf`;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="bg-gradient-to-b from-neutral-900/70 to-neutral-900/30 border border-neutral-800 rounded-2xl p-6 md:p-10 shadow-xl">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
            {/* Bloc gauche : nom + description */}
            <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-50">
                Florian Glay
            </h1>
            <p className="mt-2 text-neutral-300">
                {t("cv.profile.subtitle")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                <Badge>C, C++, Python</Badge>
                <Badge>JS / Three.js / Node</Badge>
                <Badge>Unity (C#)</Badge>
                <Badge>SQL / MAMP</Badge>
            </div>
            </div>

            {/* Bloc droite : photo de profil */}
            <div className="flex-shrink-0">
            <img
                src={`${import.meta.env.BASE_URL}assets/profile.png`}
                alt="Photo de profil"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-neutral-700 shadow-lg"
            />
            </div>

            {/* Bloc milieu : boutons en colonne */}
            <div className="flex flex-col items-start gap-3 md:items-center md:justify-center">
            <a
                href="mailto:florian.glay@student.junia.com"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-4 py-2 text-center text-neutral-100 hover:bg-neutral-800 transition"
            >
                {t("cv.profile.cta.contact")}
            </a>
            <a
                href={pdfHref}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-xl bg-accent text-white px-4 py-2 text-center hover:opacity-95 transition"
            >
                {t("cv.profile.cta.downloadCv")}
            </a>
            </div>

        </div>

        {/* Ligne bas */}
        <div className="mt-4 text-sm text-neutral-400">
            France •{" "}
            <a
            className="underline hover:text-neutral-200"
            href="https://github.com/Florian-Glay"
            target="_blank"
            rel="noreferrer"
            >
            github.com/Florian-Glay
            </a>
        </div>
      </header>


      {/* Formation & Expériences */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title={t("cv.education.title")}>
          <ul className="space-y-4">
            <li>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-neutral-100">
                    {t("cv.education.items")[0].degree}
                  </p>
                  <p className="text-neutral-300">{t("cv.education.items")[0].school}</p>
                </div>
                <span className="text-sm text-neutral-400">{t("cv.education.items")[0].years}</span>
              </div>
            </li>
            <li>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-neutral-100">
                    {t("cv.education.items")[1].degree}
                  </p>
                  <p className="text-neutral-300">
                    {t("cv.education.items")[1].school}
                  </p>
                </div>
                <span className="text-sm text-neutral-400">{t("cv.education.items")[1].years}</span>
              </div>
            </li>
          </ul>
        </Section>

        <Section title={t("cv.experience.title")}>
          <ul className="space-y-5">
            <li>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-neutral-100">{t("cv.experience.items")[0].role}</p>
                  <p className="text-neutral-300">{t("cv.experience.items")[0].place}</p>
                  <p className="mt-1 text-neutral-400 text-sm">
                    {t("cv.experience.items")[0].details}
                  </p>
                </div>
                <span className="text-sm text-neutral-400">{t("cv.experience.items")[0].year}</span>
              </div>
            </li>

            <li>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-neutral-100">{t("cv.experience.items")[1].role}</p>
                  <p className="text-neutral-300">{t("cv.experience.items")[1].place}</p>
                  <p className="mt-1 text-neutral-400 text-sm">
                    {t("cv.experience.items")[1].details}
                  </p>
                </div>
                <span className="text-sm text-neutral-400">{t("cv.experience.items")[1].year}</span>
              </div>
            </li>

            <li>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-neutral-100">{t("cv.experience.items")[2].role}</p>
                  <p className="text-neutral-300">{t("cv.experience.items")[2].place}</p>
                  <p className="mt-1 text-neutral-400 text-sm">
                    {t("cv.experience.items")[2].details}
                  </p>
                </div>
                <span className="text-sm text-neutral-400">{t("cv.experience.items")[2].year}</span>
              </div>
            </li>
          </ul>
        </Section>
      </div>

      {/* Compétences & Projets */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title={t("cv.skills.title")}>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-neutral-200 mb-2">{t("cv.skills.langs")}</p>
              <div className="flex flex-wrap gap-2">
                <Badge>C</Badge>
                <Badge>C++</Badge>
                <Badge>Python</Badge>
                <Badge>JavaScript</Badge>
                <Badge>C#</Badge>
                <Badge>SQL</Badge>
              </div>
            </div>
            <div>
              <p className="font-medium text-neutral-200 mb-2">{t("cv.skills.tools")}</p>
              <div className="flex flex-wrap gap-2">
                <Badge>HTML</Badge>
                <Badge>CSS / Tailwind</Badge>
                <Badge>Node.js</Badge>
                <Badge>Vite</Badge>
                <Badge>Three.js</Badge>
                <Badge>Cannon.js</Badge>
                <Badge>MAMP / MySQL</Badge>
                <Badge>Git / GitHub</Badge>
              </div>
            </div>
          </div>
        </Section>

        <Section title={t("cv.projects.title")}>
          <ul className="space-y-4">
            <li>
              <p className="font-medium text-neutral-100">{t("cv.projects.items")[0].name}</p>
              <p className="text-neutral-400 text-sm">
                {t("cv.projects.items")[0].details}
              </p>
            </li>
            <li>
              <p className="font-medium text-neutral-100">
                {t("cv.projects.items")[1].name}
              </p>
              <p className="text-neutral-400 text-sm">
                {t("cv.projects.items")[1].details}
              </p>
            </li>
            <li>
              <p className="font-medium text-neutral-100">{t("cv.projects.items")[2].name}</p>
              <p className="text-neutral-400 text-sm">
                {t("cv.projects.items")[2].details}
              </p>
            </li>
          </ul>
          <a
            href="https://github.com/Florian-Glay"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm text-accent underline hover:opacity-90"
          >
            {t("cv.projects.github")}
          </a>
        </Section>
      </div>

      {/* Langues & Intérêts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title={t("cv.languages.title")}>
          <div className="flex flex-wrap gap-2">
            <Badge>{t("cv.languages.list")[0]}</Badge>
            <Badge>{t("cv.languages.list")[1]}</Badge>
            <Badge>{t("cv.languages.list")[2]}</Badge>
            <Badge>{t("cv.languages.list")[3]}</Badge>
          </div>
        </Section>

        <Section title={t("cv.interests.title")}>
          <ul className="list-disc pl-5 text-neutral-300 space-y-1">
            <li>{t("cv.interests.list")[0]}</li>
            <li>{t("cv.interests.list")[1]}</li>
            <li>
              {t("cv.interests.list")[2]}{" "}
              <a
                className="underline"
                href="https://www.youtube.com/@K4TERI4music/videos"
                target="_blank"
                rel="noreferrer"
              >
                K4TERI4music
              </a>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
