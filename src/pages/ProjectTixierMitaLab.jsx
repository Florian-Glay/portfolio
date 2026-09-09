import Section from "../components/Section.jsx";
import GameEmbed from "../components/GameEmbed.jsx";
import { motion } from "framer-motion";
import { useLang } from "../lib/lang.jsx";

export default function ProjectTixierMitaLab() {
  const { t } = useLang();

  const externalUrl = "https://agnestm.iis.u-tokyo.ac.jp/";

  return (
    <>
      {/* 1) Démo intégrée */}
      <Section title="Tixier-Mita Lab" subtitle="Website">
        <div className="space-y-4">
          <GameEmbed slug="TixierMitaLabWeb" height={720}/>

          {/* Lien externe (fallback / ouverture) */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-sm transition-colors"
            >
              Link
            </a>
          </div>
        </div>
      </Section>
    
    </>
  );
}
