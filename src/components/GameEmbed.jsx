import { useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FULLSCREEN_BAR_HEIGHT = 50; // hauteur de la barre en px

const GameEmbed = ({ slug, height = 720 }) => {
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const enterFullscreen = () => {
        if (containerRef.current.requestFullscreen) {
            containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsFullscreen(false);
    };

    return (
        <div
            ref={containerRef}
            className="relative rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl overflow-hidden"
        >
            {/* Header en mode normal */}
            {!isFullscreen && (
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
                    <h2 className="text-neutral-300 font-medium capitalize">
                        {slug.replace(/-/g, " ")}
                    </h2>
                    <button
                        onClick={enterFullscreen}
                        className="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                        <Maximize2 className="w-5 h-5 text-neutral-300" />
                    </button>
                </div>
            )}

            {/* Zone du jeu */}
            <div
                className="w-full"
                style={{
                    height: isFullscreen
                        ? `calc(100vh - ${FULLSCREEN_BAR_HEIGHT}px)`
                        : height,
                    marginTop: isFullscreen ? `${FULLSCREEN_BAR_HEIGHT}px` : 0,
                }}
            >
                <iframe
                    title={slug}
                    src={`${process.env.NODE_ENV === "production" ? import.meta.env.BASE_URL : ""}/games/${slug}/index.html`}
                    className="w-full h-full"
                    allowFullScreen
                />
            </div>

            {/* Barre en plein écran */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="absolute top-0 left-0 right-0 z-50 bg-neutral-800/80 backdrop-blur-md border-b border-neutral-700 flex justify-end items-center px-3"
                        style={{ height: FULLSCREEN_BAR_HEIGHT }}
                    >
                        <button
                            onClick={exitFullscreen}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-colors"
                        >
                            <Minimize2 className="w-5 h-5 text-neutral-200" />
                            <span className="text-neutral-200 text-sm">Quitter</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GameEmbed;
