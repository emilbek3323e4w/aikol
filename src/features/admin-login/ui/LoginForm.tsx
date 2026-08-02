"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/shared/i18n/navigation";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Неверные данные");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-bg-secondary p-8"
    >
      <h1 className="text-center font-heading text-2xl text-gold">
        Вход в админ-панель
      </h1>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
        required
      />
      <Input
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={loading}>
        Войти
      </Button>
    </form>
  );
}
