import Section from "../components/Section.jsx";
import GameEmbed from "../components/GameEmbed.jsx";
import { motion } from "framer-motion";
import { useLang, useLocaleLink } from "../lib/lang";

export default function ProjectUnity(){
  const { t } = useLang();
  const link = useLocaleLink();

  return (
    <>
      <Section
        title={t("projets.vectorPhotoshop.title")} subtitle="">
        {/* Charge /public/games/curve/index.html */}
        <GameEmbed slug="curve" height={720} />
      </Section>
    </>
  );
}
