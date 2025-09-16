
import Section from "../components/Section.jsx";
import GameEmbed from "../components/GameEmbed.jsx";
import { useLang, useLocaleLink } from "../lib/lang";


export default function ProjectMinecraftDemo(){
    const { t } = useLang();
    const link = useLocaleLink();

    return (
    <>
        <Section title={t("projets.minecraftDemo.title")} subtitle={t("projets.minecraftDemo.subtitle")}>
        <GameEmbed slug="demos/minecraft" height={720} />
        </Section>

        <Section title=" " subtitle=" ">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-xl p-6">
                    <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-1">
                        <li>{t("projets.minecraftDemo.list1")}</li>
                        <li>{t("projets.minecraftDemo.list2")}</li>
                        <li>{t("projets.minecraftDemo.list3")}</li>
                    </ul>
                </div>
            </div>
        </Section>
    </>
);
}