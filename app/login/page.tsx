"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenziali errate");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Errore durante il login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-2 text-center text-3xl font-semibold">Login Admin</h1>
        <p className="mb-6 text-center text-sm text-neutral-400">
          Accedi al pannello protetto di Rofi
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-white outline-none"
          />

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className={`w-full rounded-xl px-4 py-3 font-semibold transition ${
              isLoading || !username.trim() || !password.trim()
                ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
                : "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-lg shadow-blue-900/30"
            }`}
          >
            {isLoading ? "Accesso..." : "Accedi"}
          </button>
        </form>
      </div>
    </main>
  );
}
