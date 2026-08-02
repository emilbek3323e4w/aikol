"use client";

import { signOut } from "next-auth/react";
import { usePathname, Link } from "@/shared/i18n/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Меню" },
  { href: "/admin/packages", label: "Пакеты" },
  { href: "/admin/gallery", label: "Галерея" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/news", label: "Новости" },
  { href: "/admin/settings", label: "Настройки" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-1 border-r border-line bg-bg-secondary p-4">
      <span className="mb-6 px-3 font-heading text-xl text-gold">Айкөл</span>

      {LINKS.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`min-h-11 rounded-lg px-3 py-2.5 text-sm ${
              isActive
                ? "bg-gold/10 text-gold"
                : "text-text-muted hover:bg-hover hover:text-text"
            }`}
          >
            {link.label}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-auto min-h-11 rounded-lg px-3 py-2.5 text-left text-sm text-text-muted hover:bg-hover hover:text-danger"
      >
        Выйти
      </button>
    </aside>
  );
}
