"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>(
    [],
  );
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>(
    [],
  );

  const [aiOccasions, setAiOccasions] = useState<string[]>([]);
  const [aiAges, setAiAges] = useState<string[]>([]);
  const [aiGenders, setAiGenders] = useState<string[]>([]);
  const [aiRelationships, setAiRelationships] = useState<string[]>([]);
  const [aiPersonalities, setAiPersonalities] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");
  useEffect(() => {
    if (!isLoadingAi) return;

    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isLoadingAi]);

  const [realProductName, setRealProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "">("");

  const isBasicValid = name.trim() !== "" && link.trim() !== "";

  const isFormValid =
    selectedOccasions.length > 0 &&
    selectedAges.length > 0 &&
    selectedGenders.length > 0 &&
    selectedRelationships.length > 0 &&
    selectedPersonalities.length > 0;

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch {
      alert("Errore durante il logout");
    }
  }

  function toggleValue(
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  }

  async function handleSave() {
    if (!name || !link) {
      alert("Inserisci nome e link");
      return;
    }

    try {
      setModalMessage("Sto salvando il prodotto");
      setModalType("");
      setIsLoadingAi(true);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: name,
          realName: realProductName || name,
          sourceUrl: link,
          sourceShop: "Amazon",
          price: productPrice ? Number(productPrice) : 0,
          imageUrl: productImage || "",
          minAge: null,
          occasions: selectedOccasions,
          ages: selectedAges,
          genders: selectedGenders,
          relationships: selectedRelationships,
          personalities: selectedPersonalities,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalMessage(data.error || "Errore durante il salvataggio");
        setModalType("error");
        return;
      }

      setModalMessage("Prodotto salvato correttamente");
      setModalType("success");
      setName("");
      setLink("");
      setRealProductName("");
      setProductImage("");
      setProductPrice("");

      setSelectedOccasions([]);
      setSelectedAges([]);
      setSelectedGenders([]);
      setSelectedRelationships([]);
      setSelectedPersonalities([]);

      setAiOccasions([]);
      setAiAges([]);
      setAiGenders([]);
      setAiRelationships([]);
      setAiPersonalities([]);
    } catch (err) {
      setModalMessage("Errore durante il salvataggio");
      setModalType("error");
    } finally {
      setIsLoadingAi(false);
    }
  }

  const occasionsList = [
    { label: "Compleanno", value: "compleanno" },
    { label: "Natale", value: "natale" },
    { label: "Anniversario", value: "anniversario" },
    { label: "Regalo aziendale", value: "regalo-aziendale" },
  ];

  const gendersList = [
    { label: "Maschile", value: "maschio" },
    { label: "Femminile", value: "femmina" },
    { label: "Unisex", value: "unisex" },
  ];

  const relationshipsList = [
    { label: "Partner", value: "partner" },
    { label: "Familiare", value: "familiare" },
    { label: "Amico", value: "amico" },
    { label: "Dipendente", value: "dipendente" },
  ];

  const personalitiesList = [
    { label: "Creativa", value: "creativa" },
    { label: "Tecnologica", value: "tecnologica" },
    { label: "Sportiva", value: "sportiva" },
    { label: "Elegante", value: "elegante" },
  ];

  const agesList = [
    { label: "6-12", value: "6-12" },
    { label: "13-18", value: "13-18" },
    { label: "18-25", value: "18-25" },
    { label: "26-35", value: "26-35" },
    { label: "36-50", value: "36-50" },
    { label: "50+", value: "50+" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="w-[120px]" />

          <h1 className="flex-1 text-3xl font-semibold text-white text-center">
            Pannello Inserimento Prodotti
          </h1>

          <div className="flex w-[120px] justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 cursor-pointer shadow-lg shadow-red-900/30"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[520px_560px] gap-12 items-start">
          {/* SINISTRA */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl p-8 shadow-2xl">
            <div className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur">
              <h2 className="text-xl font-semibold text-white">
                Inserisci prodotto
              </h2>

              <input
                type="text"
                placeholder="Nome prodotto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-white"
              />

              <input
                type="text"
                placeholder="Link prodotto"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-white"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!isBasicValid}
                  onClick={async () => {
                    try {
                      setModalMessage("Sto analizzando il prodotto");
                      setModalType("");
                      setIsLoadingAi(true);

                      const res = await fetch("/api/admin/elabora", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          productName: name,
                          productUrl: link,
                        }),
                      });

                      const data = await res.json();

                      if (!res.ok) {
                        setModalMessage(
                          data.error || "Errore durante l'elaborazione",
                        );
                        setModalType("error");
                        return;
                      }

                      setModalMessage("");
                      setModalType("");

                      setRealProductName(data.realProductName || "");
                      setProductImage(data.productImage || "");
                      setProductPrice(data.productPrice || "");

                      setAiOccasions(data.suggestions.occasions || []);
                      setAiAges(data.suggestions.ages || []);
                      setAiGenders(data.suggestions.genders || []);
                      setAiRelationships(data.suggestions.relationships || []);
                      setAiPersonalities(data.suggestions.personalities || []);
                    } catch (error) {
                      setModalMessage("Errore durante l'elaborazione");
                      setModalType("error");
                    } finally {
                      setIsLoadingAi(false);
                    }
                  }}
                  className={`w-full rounded-xl px-4 py-3 font-semibold transition ${
                    isBasicValid
                      ? "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                      : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  Elabora
                </button>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 flex gap-4 items-center">
                {productImage ? (
                  <img
                    src={productImage}
                    alt="Anteprima prodotto"
                    className="h-30 w-30 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-neutral-800 text-xs text-neutral-400">
                    No img
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm text-neutral-400">
                    Prodotto rilevato
                  </span>

                  <span className="text-sm font-medium text-white">
                    {realProductName || "Nome non trovato"}
                  </span>

                  <span className="text-sm text-neutral-400">
                    Prezzo: {productPrice || "non trovato"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                <p className="text-lg font-semibold text-neutral-200 mb-3">
                  Mancano prodotti di questo tipo:
                </p>

                <div className="flex flex-wrap gap-4">
                  <span className="text-sm bg-neutral-800 text-neutral-200 px-4 py-2 rounded-full">
                    Regali uomo 30-50
                  </span>
                  <span className="text-sm bg-neutral-800 text-neutral-200 px-4 py-2 rounded-full">
                    Regali donna 30-50
                  </span>
                  <span className="text-sm bg-neutral-800 text-neutral-200 px-4 py-2 rounded-full">
                    Regali sotto 20€
                  </span>
                  <span className="text-sm bg-neutral-800 text-neutral-200 px-4 py-2 rounded-full">
                    Regali per partner
                  </span>
                  <span className="text-sm bg-neutral-800 text-neutral-200 px-4 py-2 rounded-full">
                    Regali per amici
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DESTRA */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-white mb-2 text-center">
                Valido per
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* OCCASIONE */}
                <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70">
                  <div className="bg-yellow-400 px-5 py-3 text-3xl font-bold text-black">
                    Occasione
                  </div>

                  <div className="space-y-4 p-5 text-lg">
                    {occasionsList.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-3 cursor-pointer text-lg"
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedOccasions.includes(item.value)}
                          onChange={() =>
                            toggleValue(
                              item.value,
                              selectedOccasions,
                              setSelectedOccasions,
                            )
                          }
                        />

                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                            selectedOccasions.includes(item.value)
                              ? "border-green-600 bg-green-600"
                              : aiOccasions.includes(item.value)
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-neutral-500 bg-transparent"
                          }`}
                        >
                          {selectedOccasions.includes(item.value) && (
                            <span className="text-base font-black leading-none text-black">
                              ✓
                            </span>
                          )}
                        </span>

                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ETA */}
                <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70">
                  <div className="bg-yellow-400 px-5 py-3 text-3xl font-bold text-black">
                    Fascia d'età
                  </div>

                  <div className="space-y-4 p-5 text-lg">
                    {agesList.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-3 cursor-pointer text-lg"
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedAges.includes(item.value)}
                          onChange={() =>
                            toggleValue(
                              item.value,
                              selectedAges,
                              setSelectedAges,
                            )
                          }
                        />

                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                            selectedAges.includes(item.value)
                              ? "border-green-600 bg-green-600"
                              : aiAges.includes(item.value)
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-neutral-500 bg-transparent"
                          }`}
                        >
                          {selectedAges.includes(item.value) && (
                            <span className="text-base font-black leading-none text-black">
                              ✓
                            </span>
                          )}
                        </span>

                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SESSO */}
                <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70">
                  <div className="bg-yellow-400 px-5 py-3 text-3xl font-bold text-black">
                    Sesso
                  </div>

                  <div className="space-y-4 p-5 text-lg">
                    {gendersList.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-3 cursor-pointer text-lg"
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedGenders.includes(item.value)}
                          onChange={() =>
                            toggleValue(
                              item.value,
                              selectedGenders,
                              setSelectedGenders,
                            )
                          }
                        />

                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                            selectedGenders.includes(item.value)
                              ? "border-green-600 bg-green-600"
                              : aiGenders.includes(item.value)
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-neutral-500 bg-transparent"
                          }`}
                        >
                          {selectedGenders.includes(item.value) && (
                            <span className="text-base font-black leading-none text-black">
                              ✓
                            </span>
                          )}
                        </span>

                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* PER CHI È */}
                <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70">
                  <div className="bg-yellow-400 px-5 py-3 text-3xl font-bold text-black">
                    Per chi è
                  </div>

                  <div className="space-y-4 p-5 text-lg">
                    {relationshipsList.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-3 cursor-pointer text-lg"
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedRelationships.includes(item.value)}
                          onChange={() =>
                            toggleValue(
                              item.value,
                              selectedRelationships,
                              setSelectedRelationships,
                            )
                          }
                        />

                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                            selectedRelationships.includes(item.value)
                              ? "border-green-600 bg-green-600"
                              : aiRelationships.includes(item.value)
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-neutral-500 bg-transparent"
                          }`}
                        >
                          {selectedRelationships.includes(item.value) && (
                            <span className="text-base font-black leading-none text-black">
                              ✓
                            </span>
                          )}
                        </span>

                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* PERSONALITÀ */}
                <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70">
                  <div className="bg-yellow-400 px-5 py-3 text-3xl font-bold text-black">
                    Personalità
                  </div>

                  <div className="space-y-4 p-5 text-lg">
                    {personalitiesList.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-3 cursor-pointer text-lg"
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedPersonalities.includes(item.value)}
                          onChange={() =>
                            toggleValue(
                              item.value,
                              selectedPersonalities,
                              setSelectedPersonalities,
                            )
                          }
                        />

                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                            selectedPersonalities.includes(item.value)
                              ? "border-green-600 bg-green-600"
                              : aiPersonalities.includes(item.value)
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-neutral-500 bg-transparent"
                          }`}
                        >
                          {selectedPersonalities.includes(item.value) && (
                            <span className="text-base font-black leading-none text-black">
                              ✓
                            </span>
                          )}
                        </span>

                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-start-2 flex justify-center items-start mt-2 self-start">
                  <button
                    type="submit"
                    onClick={handleSave}
                    disabled={!(isFormValid && isBasicValid)}
                    className={`w-full max-w-[260px] rounded-xl px-6 py-3 font-semibold text-2xl transition ${
                      isFormValid && isBasicValid
                        ? "bg-green-600 text-white hover:bg-green-500 cursor-pointer"
                        : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    }`}
                  >
                    Salva
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(modalMessage || isLoadingAi) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl text-center">
            {" "}
            <h2
              className={`mb-3 text-xl font-semibold ${
                isLoadingAi
                  ? "text-blue-400"
                  : modalType === "success"
                    ? "text-green-400"
                    : "text-red-400"
              }`}
            >
              {isLoadingAi
                ? "Elaborazione in corso"
                : modalType === "success"
                  ? "Operazione completata"
                  : "Errore"}
            </h2>
            <p className="mb-6 text-base text-neutral-300">
              {" "}
              {modalMessage}
              {isLoadingAi && (
                <span className="inline-block w-6 text-left">
                  {loadingDots}
                </span>
              )}
            </p>
            {!isLoadingAi && (
              <button
                onClick={() => {
                  setModalMessage("");
                  setModalType("");
                }}
                className="w-full cursor-pointer rounded-xl bg-white py-2 font-semibold text-black transition hover:bg-neutral-200"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
