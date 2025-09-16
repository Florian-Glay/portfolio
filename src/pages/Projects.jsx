import Section from "../components/Section.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang, useLocaleLink } from "../lib/lang";

export default function Projects(){
  const { t } = useLang();
  const link = useLocaleLink();

  const Card = ({ to, img, title, subtitle, subtitle2, color="neutral"}) => (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Link to={link(to)} className="block rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-tr from-accent via-purple-600 to-pink-500 p-[2px] rounded-2xl">
          <div className="bg-neutral-950 rounded-2xl">
            <img src={img} alt={title} className="w-full aspect-video object-cover rounded-t-2xl" />
            <div className="p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-neutral-400">{subtitle}</p>
              {subtitle2 && color === "green" && (<p className={ `text-sm whitespace-pre-line text-green-400`}>{subtitle2}</p>)}
              {subtitle2 && color === "red" && (<p className={ `text-sm whitespace-pre-line text-red-400`}>{subtitle2}</p>)}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <>
      <Section title={t("projets.projects")} subtitle={t("projets.selectProject")}>
        <div className="grid md:grid-cols-3 gap-6">
          <Card to="/projects/mariokart"  img={`${import.meta.env.BASE_URL}assets/mk-track.png`} title={t("projets.mkTitle")} subtitle={t("projets.mkSubtitle")} subtitle2={t("projets.playableHere")} color ="green"/>
          <Card to="/projects/sfml" img={`${import.meta.env.BASE_URL}assets/sfml-screenshot.png`} title={t("projets.smTitle")} subtitle={t("projets.smSubtitle")} subtitle2={t("projets.videoDemo")} color ="red"/>
          <Card to="/projects/unity" img={`${import.meta.env.BASE_URL}assets/rpg-menu.png`} title={t("projets.rpgTitle")} subtitle={t("projets.rpgSubtitle")} subtitle2={t("projets.playableHere")} color ="green"/>
          <Card to="/projects/minecraftdemo" img={`${import.meta.env.BASE_URL}assets/minecraftDemo.png`} title={t("projets.mcDemoTitle")} subtitle={t("projets.mcDemoSubtitle")} subtitle2={t("projets.onlyDemo")} color ="red"/>
        </div>
      </Section>
    </>
  );
}
