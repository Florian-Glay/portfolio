import Section from "../components/Section.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang, useLocaleLink } from "../lib/lang";

export default function Home(){
  const { t } = useLang();
  const link = useLocaleLink();

  const Card = ({ to, img, title, subtitle, subtitle2, color="neutral"}) => (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Link to={link(to)} className="block rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-tr from-accent via-purple-500 to-pink-500 p-[2px] rounded-2xl">
          <div className="bg-neutral-950 rounded-2xl">
            <img src={img} alt={title} className="w-full aspect-[10/2] object-cover rounded-t-2xl" />
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
      {/* h = 100svh - 56px (navbar h-14), min pour petits écrans */}
      <section className="relative min-h-[calc(100svh-56px)] grid place-items-center overflow-hidden px-4">
        <img
          src={`${import.meta.env.BASE_URL}assets/background.png`}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/25 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-wider leading-tight">
            {t("site.hero.headline")}
          </h1>
          <p className="text-neutral-300 mt-2 max-w-2xl mx-auto px-2">
            {t("site.hero.sub")}
          </p>

          {/* Boutons : carte floutée statique, on n'anime que l'intérieur (pas de scale) */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { to: link("/projects"), label: t("home.buttons.projects") },
              { to: link("/music"),    label: t("home.buttons.music") },
              { to: link("/running"),  label: t("home.buttons.running") },
              { to: link("/cv"),       label: t("home.buttons.cv") },
            ].map((b) => (
              <div
                key={b.to}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden inline-flex items-center gap-2 bg-accent text-white rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 hover:bg-accent-soft transition text-sm sm:text-base"
              >
                {/* Hover visuel à partir de md uniquement (pas sur iPhone SE) */}
                <div className="group md:transition-transform md:duration-200 md:will-change-transform md:transform-gpu md:hover:-translate-y-0.5">
                  <Link
                    to={b.to}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5
                               text-white bg-accent rounded-xl
                               transition-colors hover:bg-accent-soft
                               text-sm sm:text-base"
                  >
                    {b.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Section title={t("home.actu")} subtitle={t("home.actuDesc")}>
            <div className="grid md:grid-cols-1 gap-2">
              <Card to="/projects/vector" img={`${import.meta.env.BASE_URL}assets/vectorImage.png`} title={t("projets.vectTitle")} subtitle={t("projets.vectSubtitle")} subtitle2={t("projets.playableHere")} color ="green"/>
             </div>
          </Section>
        </motion.div>
      </section>

      <Section title={t("home.quickOverview")} subtitle=" ">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cartes info : même principe, pas d'animation sur le conteneur flouté */}
          {[
            {
              title: t("home.appsGames"),
              text: t("home.appsGamesDesc"),
            },
            {
              title: t("home.music"),
              text: t("home.musicDesc"),
            },
            {
              title: t("home.running"),
              text: t("home.runningDesc"),
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden"
            >
              <div className="p-6 md:transition-transform md:duration-200 md:will-change-transform md:transform-gpu md:hover:-translate-y-0.5">
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-neutral-300">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("home.actu2")} subtitle={t("home.actuDesc2")}>
            <div className="grid md:grid-cols-1 gap-2">
              <Card to="/projects/unity" img={`${import.meta.env.BASE_URL}assets/rpg-ingame.png`} title={t("projets.rpgTitle")} subtitle={t("projets.rpgSubtitle")} subtitle2={t("projets.playableHere")} color ="green"/>
             </div>
          </Section>
    </>
  );
}
