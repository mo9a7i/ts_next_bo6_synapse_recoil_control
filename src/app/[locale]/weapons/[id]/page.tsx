import { WeaponConfig } from "@/components/WeaponConfig";
import { readFileSync, existsSync } from "fs";
import { parseXML } from "@/lib/xml";
import { join } from "path";
import { weapons } from "@/data/weapons";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export const dynamic = 'force-static'

export function generateStaticParams() {
    return routing.locales.flatMap(locale => 
        weapons.map(weapon => ({
            locale,
            id: weapon.id
        }))
    );
}

export default async function WeaponConfigPage({
    params
}: {
    params: Promise<{ id: string; locale: string }>
}) {
    const { id, locale } = await params;
    setRequestLocale(locale);

    const weapon = weapons.find(w => w.id === id);
    
    if (!weapon) notFound();

    // Load universal macro
    const universalXmlPath = join(process.cwd(), "src", "data", "universal", `${id}.xml`);
    const universalXmlContent = readFileSync(universalXmlPath, "utf-8");
    const universalMacroData = {
      ...parseXML(universalXmlContent),
      type: 'universal' as const
    };

    // Load specific macro if it exists
    let specificMacroData = undefined;
    const specificXmlPath = join(process.cwd(), "src", "data", "specific", `${id}.xml`);
    if (existsSync(specificXmlPath)) {
      const specificXmlContent = readFileSync(specificXmlPath, "utf-8");
      specificMacroData = {
        ...parseXML(specificXmlContent),
        type: 'specific' as const
      };
    }

    return (
        <div className="container mx-auto p-4">

            <WeaponConfig 
                universalMacroData={universalMacroData}
                specificMacroData={specificMacroData}
                weaponImage={weapon.image}
            />
        </div>
    );
}
