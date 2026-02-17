import Section from "../components/Section.jsx";
import GameEmbed from "../components/GameEmbed.jsx";
import { useLang, useLocaleLink } from "../lib/lang.jsx";


export default function ProjectMarioKartDeluxe(){
    const { t } = useLang();
    const link = useLocaleLink();

    return (
    <>
        <Section title="Mario Kart 3D (JavaScript)" subtitle={t("projets.marioKart.sub")}>
        <GameEmbed slug="marioKartDeluxe" height={720} />
        </Section>

        <Section title={t("projets.marioKart.noCommercial")} subtitle=" ">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-xl p-6">
                    <h4 className="font-semibold mb-2">{t("projets.marioKart.playBetween")}</h4>
                    <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-1">
                        <li>"ZQSD"</li>
                        <li>"OKLM"</li>
                        <li>"GVBN"</li>
                        <li>"←↑→↓"</li>
                        <li>{t("projets.marioKart.driftTip")}</li>
                    </ul>
                </div>
                <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-xl p-6">
                    <h4 className="font-semibold mb-2">{t("projets.marioKart.bluetoothControls")}</h4>
                    <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-1">
                        {t("projets.marioKart.bluetoothControlsList").map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="grid md:grid-cols-1 gap-6">
                <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-xl p-6">
                    <h4 className="font-semibold mb-2">{t("projets.marioKart.crazyAI")}</h4>
                    <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-1">
                        <li>{t("projets.marioKart.aiDesc")}</li>
                        <li>{t("projets.marioKart.aiDesc2")}</li>
                    </ul>
                </div>
            </div>
        </Section>

        <Section title={t("projets.marioKart.technicalDetails")} subtitle=" ">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-xl p-6">
                    <h4 className="font-semibold mb-2">{t("projets.marioKart.stack")}</h4>
                    <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-1">
                        <li>JavaScript ES modules, Vite</li>
                        <li>{t("projets.marioKart.physique")}</li>
                        <li>{t("projets.marioKart.cam")}</li>
                        <li>{t("projets.marioKart.responsiveUI")}</li>
                    </ul>
                </div>
                <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-xl p-6">
                    <h4 className="font-semibold mb-2">{t("projets.marioKart.keyFeatures")}</h4>
                    <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-1">
                        <li>{t("projets.marioKart.driftBoost")}</li>
                        <li>{t("projets.marioKart.optimized")}</li>
                        <li>{t("projets.marioKart.checkpoints")}</li>
                        <li>{t("projets.marioKart.controllerSupport")}</li>
                    </ul>
                </div>
            </div>
        </Section>
    </>
);
}