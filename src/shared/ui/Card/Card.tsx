import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-transparent bg-bg-secondary shadow-sm transition-all hover:-translate-y-1 hover:border-gold/40 ${className}`}
      {...props}
    />
  );
}
