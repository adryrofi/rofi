"use client";

import { useState } from "react";

const missingCategories = [
  "Regali uomo 30-50",
  "Regali donna 30-50",
  "Regali sotto 20€",
  "Regali per partner",
  "Regali per amici",
];

export default function AdminPage() {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl p-8 shadow-2xl">
        <h1 className="mb-8 text-center text-2xl font-semibold">
          Inserisci prodotto
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome prodotto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-base text-white outline-none transition focus:border-white"
          />

          <input
            type="text"
            placeholder="Link prodotto"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-base text-white outline-none transition focus:border-white"
          />

          <button className="mt-2 w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90">
            Salva
          </button>
        </div>

        <div className="my-8 h-px bg-neutral-800" />

        <div>
          <p className="mb-4 text-center text-sm text-neutral-400">
            Mancano prodotti di questo tipo
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {missingCategories.map((category) => (
              <div
                key={category}
                className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
