import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import { Button } from "@/shared/ui/Button";
import { getWhatsappHref } from "@/shared/lib/contact";

interface HeroProps {
  title: string;
  subtitle: string;
  whatsappNumber: string;
}

export function Hero({ title, subtitle, whatsappNumber }: HeroProps) {
  const t = useTranslations("home");
  const whatsappHref = getWhatsappHref(
    "Здравствуйте! Хочу узнать про зал в «Айкөл».",
    whatsappNumber,
  );

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#2a2a2a,#1a1a1a_70%)] px-4 text-center">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6">
        <h1 className="font-heading text-4xl text-gold sm:text-6xl">
          {title}
        </h1>
        <p className="text-lg text-white/70">{subtitle}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button>{t("heroCtaContact")}</Button>
          </a>
          <Link href="/menu">
            <Button variant="secondary">{t("heroCtaMenu")}</Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-gold">
        ↓
      </div>
    </section>
  );
}
