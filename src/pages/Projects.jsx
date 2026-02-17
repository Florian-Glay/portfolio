import Section from "../components/Section.jsx";
import Card from "../components/Card.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang, useLocaleLink } from "../lib/lang";

export default function Projects(){
  const { t } = useLang();
  const link = useLocaleLink();

  return (
    <>
      <Section title={t("projets.projects")} subtitle={t("projets.selectProject")}>
        <div className="grid md:grid-cols-3 gap-6">
          <Card to="/projects/marioKartDeluxe"  img={`${import.meta.env.BASE_URL}assets/mk-deluxe.png`}  title={t("projets.mkTitle")} subtitle={t("projets.mkSubtitle")} subtitle2={t("projets.playableHere")} color ="green"/>
          <Card to="/projects/slidelab"  img={`${import.meta.env.BASE_URL}assets/slideLab-img.png`} title={t("projets.slideLabTitle")} subtitle={t("projets.slideLabSubtitle")} subtitle2={t("projets.appHere")} color ="green"/>
          <Card to="/projects/mariokart"  img={`${import.meta.env.BASE_URL}assets/mk-track.png`} title={t("projets.mkTitle")} subtitle={t("projets.mkSubtitle")} subtitle2={t("projets.playableHere")} color ="green"/>
          <Card to="/projects/vector" img={`${import.meta.env.BASE_URL}assets/vectorImage.png`} title={t("projets.vectTitle")} subtitle={t("projets.vectSubtitle")} subtitle2={t("projets.playableHere")} color ="green"/>
          <Card to="/projects/unity" img={`${import.meta.env.BASE_URL}assets/rpg-menu.png`} title={t("projets.rpgTitle")} subtitle={t("projets.rpgSubtitle")} subtitle2={t("projets.playableHere")} color ="green"/>
          <Card to="/projects/minecraftdemo" img={`${import.meta.env.BASE_URL}assets/minecraftDemo.png`} title={t("projets.mcDemoTitle")} subtitle={t("projets.mcDemoSubtitle")} subtitle2={t("projets.onlyDemo")} color ="red"/>
          <Card to="/projects/sfml" img={`${import.meta.env.BASE_URL}assets/sfml-screenshot.png`} title={t("projets.smTitle")} subtitle={t("projets.smSubtitle")} subtitle2={t("projets.videoDemo")} color ="red"/>
        </div>
      </Section>
    </>
  );
}
