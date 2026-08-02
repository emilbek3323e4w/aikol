import { Navbar } from "@/widgets/navbar";
import { Footer } from "@/widgets/footer";
import { WhatsappButton } from "@/widgets/whatsapp-button";
import { siteConfig } from "@/shared/config/site";
import { getSettingsMap } from "@/entities/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettingsMap();

  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: settings.phone_primary,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Бишкек",
      addressCountry: "KG",
    },
    servesCuisine: ["Kyrgyz", "European"],
    openingHours: `Mo-Su ${settings.work_hours}`,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <Navbar whatsappNumber={settings.whatsapp_number} />
      <main className="flex flex-1 flex-col pt-20">{children}</main>
      <Footer settings={settings} />
      <WhatsappButton whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
