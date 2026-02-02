import Section from "../components/Section.jsx";
import GameEmbed from "../components/GameEmbed.jsx";
import { motion } from "framer-motion";
import { useLang } from "../lib/lang.jsx";

export default function ProjectSlideLab() {
  const { t } = useLang();

  const externalUrl = "https://florian-glay.github.io/Projet-Informatique-S6-GR4/";

  return (
    <>
      {/* 1) Démo intégrée */}
      <Section title={t("projets.slideLab.title")} subtitle={t("projets.slideLab.subtitle")}>
        <div className="space-y-4">
          <GameEmbed
            slug="SlideLab"
            height={720}
            externe={externalUrl}
          />

          {/* Lien externe (fallback / ouverture) */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-sm transition-colors"
            >
              {t("projets.slideLab.projectLinkLabel")} ↗
            </a>
          </div>
        </div>
      </Section>

      {/* 2) Présentation + Pitch */}
      <Section title="Présentation" subtitle={" "}>
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6"
          >
            <h4 className="font-semibold mb-2 text-neutral-100">Contexte</h4>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {t("projets.slideLab.presentation")}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6"
          >
            <h4 className="font-semibold mb-2 text-neutral-100">Pitch</h4>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {t("projets.slideLab.pitch")}
            </p>
          </motion.div>
        </div>
      </Section>

      {/* 3) Fonctionnalités clés */}
      <Section title={t("projets.slideLab.featuresTitle")} subtitle={" "}>
        <div className="grid lg:grid-cols-1 gap-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6"
          >
            <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-2">
              {(t("projets.slideLab.features") || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Section>

      {/* 4) Cas d’usage */}
      <Section title={t("projets.slideLab.useCasesTitle")} subtitle={" "}>
        <div className="grid lg:grid-cols-1 gap-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6"
          >
            <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-2">
              {(t("projets.slideLab.useCases") || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Section>

      {/* 5) Valeur ajoutée */}
      <Section title={t("projets.slideLab.valueTitle")} subtitle={" "}>
        <div className="grid lg:grid-cols-1 gap-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6"
          >
            <p className="text-neutral-300 text-sm leading-relaxed">
              {t("projets.slideLab.value")}
            </p>
          </motion.div>
        </div>
      </Section>

      {/* 6) Tech & architecture */}
      <Section title={t("projets.slideLab.techTitle")} subtitle={" "}>
        <div className="grid lg:grid-cols-1 gap-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6"
          >
            <h4 className="font-semibold mb-2 text-neutral-100">Stack</h4>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {t("projets.slideLab.tech")}
            </p>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
