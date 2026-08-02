import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import { Button } from "@/shared/ui/Button";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="font-heading text-8xl text-gold">404</span>
      <p className="text-lg text-text-muted">{t("notFoundTitle")}</p>
      <Link href="/">
        <Button>{t("goHome")}</Button>
      </Link>
    </div>
  );
}
