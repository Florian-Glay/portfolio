import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocaleLink } from "../lib/lang";

const ratioClass = (ratio) => {
  if (!ratio) return "aspect-video";
  if (ratio === "video") return "aspect-video";
  if (ratio === "banner") return "aspect-[16/6]";
  if (ratio === "wide") return "aspect-[21/9]";
  if (ratio === "square") return "aspect-square";
  // si tu passes directement "aspect-[10/2]" par exemple :
  if (ratio.startsWith("aspect-[")) return ratio;
  return "aspect-video";
};

const Card = ({to, img, title, subtitle, subtitle2, color = "neutral", ratio = "video"}) => {
  const link = useLocaleLink();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group"
    >
      <Link to={link(to)} className="block">
        <div
          className={[
            "relative overflow-hidden rounded-2xl",
            // look cinéma
            "bg-black",
            "shadow-[0_18px_60px_rgba(0,0,0,.65)]",
            // hover : ombre un peu plus présente
            "transition-shadow duration-500",
            "group-hover:shadow-[0_28px_90px_rgba(0,0,0,.85)]",
          ].join(" ")}
        >
          {/* IMAGE */}
          <motion.img
            src={img}
            alt={title}
            className={[
              "w-full",
              ratioClass(ratio),
              "object-cover",
              // rendu plus “trailer”
              "brightness-[.92] contrast-[1.05] saturate-[.95]",
              "transition duration-700 ease-out",
              "group-hover:scale-[1.04] group-hover:brightness-[.98] group-hover:contrast-[1.12] group-hover:saturate-[1.02]",
            ].join(" ")}
            loading="lazy"
          />

          {/* GRADIENT CINÉMATIQUE (bas -> haut) */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            {/* léger vignettage pour “cinéma” */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_35%,rgba(0,0,0,.55)_100%)] opacity-60" />
          </div>

          {/* TEXTE SUR L’IMAGE */}
          <motion.div
            className="absolute inset-x-0 bottom-0 p-4 sm:p-5"
            initial={false}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex justify-center">
                <div className="text-center max-w-[90%]">
                    <h3 className="text-white font-semibold tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,.65)] line-clamp-1">
                    {title}
                    </h3>

                    {subtitle && (
                    <p className="text-sm text-white/70 drop-shadow-[0_2px_16px_rgba(0,0,0,.65)] line-clamp-1">
                        {subtitle}
                    </p>
                    )}

                    {subtitle2 && (
                    <p
                        className={[
                        "mt-1 text-sm whitespace-pre-line drop-shadow-[0_2px_16px_rgba(0,0,0,.65)]",
                        color === "green"
                            ? "text-emerald-300/90"
                            : color === "red"
                            ? "text-rose-300/90"
                            : "text-white/70",
                        ].join(" ")}
                    >
                        {subtitle2}
                    </p>
                    )}
                </div>
            </div>
          </motion.div>

          {/* petit shine discret au hover (pas flashy) */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute -inset-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;
