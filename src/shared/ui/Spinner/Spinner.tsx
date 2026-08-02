export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Загрузка"
      className={`h-5 w-5 animate-spin rounded-full border-2 border-gold/30 border-t-gold ${className}`}
    />
  );
}
