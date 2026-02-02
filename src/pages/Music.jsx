// Music.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Section from "../components/Section.jsx";
import { videos } from "../data/music.js";
import { useLang } from "../lib/lang";
import "../styles.css";

export default function Music(){
  const { t } = useLang();
  const [params, setParams] = useSearchParams();

  // current depuis l’URL (?v=...) ou 1ère vidéo
  const firstId = videos[0]?.id ?? null;
  const initial = useMemo(() => {
    const v = params.get("v");
    return videos.some(x => x.id === v) ? v : firstId;
  }, [params, firstId]);
  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    const v = params.get("v");
    if (v && v !== current && videos.some(x => x.id === v)) {
      setCurrent(v);
    }
  }, [params, current]);

  const selectVideo = (id) => {
    setCurrent(id);
    const p = new URLSearchParams(params);
    p.set("v", id);
    setParams(p, { replace: true });
  };

  return (
    <>
      <Section title={t("music.k4teriMusic")} subtitle={t("music.selectThumb")}>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          {current && (
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${current}`}
              title="YouTube player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </Section>

      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(v => (
            <Card
              key={v.id}
              id={v.id}
              title={v.title}
              selected={v.id === current}
              onSelect={() => selectVideo(v.id)}
            />
          ))}
        </div>
      </Section>
    </>
  );
}

/** --------- Carte miniature --------- */
function Card({ id, title, selected, onSelect }) {
  const { t } = useLang();
  const ref = useRef(null);

  useEffect(() => {}, [selected]);

  return (
    
    <article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-selected={selected}
      onClick={onSelect}
      onKeyDown={(e)=> (e.key === "Enter" || e.key === " ") && onSelect()}
      className={[
        "relative text-left rounded-2xl overflow-hidden cursor-pointer outline-none",
        "bg-neutral-950 border transition-all h-full flex flex-col",
        selected
          ? "ring-2 ring-emerald-400 shadow-2xl border-transparent"
          : "border-white/10 hover:ring-1 hover:ring-white/15",
      ].join(" ")}
    >
      {/* Badge En lecture */}
      {selected && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                            bg-black/70 text-white backdrop-blur border border-white/10">
            <EqualizerIcon />
            {t("music.selected")}
          </span>
        </div>
      )}

      <div className="bg-gradient-to-tr from-accent via-purple-600 to-pink-500 p-[2px] rounded-2xl">
        <div className="bg-neutral-950 rounded-2xl overflow-hidden">
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
          <motion.div
            className="p-4 min-h-[4.5rem]"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
          >
            <h4 className="font-semibold line-clamp-1">{title}</h4>
            <p className="text-sm text-neutral-400">@K4TERI4music</p>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

function EqualizerIcon() {
  return (
    <div className="loader">
      <div className="loading">
        <div className="load" />
        <div className="load" />
        <div className="load" />
        <div className="load" />
      </div>
    </div>
  );
}
