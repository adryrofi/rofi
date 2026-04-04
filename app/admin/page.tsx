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

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [aiOccasions, setAiOccasions] = useState<string[]>([]);
  const [aiAges, setAiAges] = useState<string[]>([]);
  const [aiGenders, setAiGenders] = useState<string[]>([]);
  const [aiRelationships, setAiRelationships] = useState<string[]>([]);
  const [aiPersonalities, setAiPersonalities] = useState<string[]>([]);
  const [aiCategories, setAiCategories] = useState<string[]>([]);
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

  // 🔒 Popup bloccanti Amazon
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showPricePopup, setShowPricePopup] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "">("");

  const [debugReport, setDebugReport] = useState<any>(null);
  const [showDebugPopup, setShowDebugPopup] = useState(false);

  {
    showDebugPopup && debugReport && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
          <h2 className="mb-5 text-2xl font-semibold text-white text-center">
            Debug salvataggio prodotto
          </h2>

          <div className="space-y-2 text-sm text-neutral-200">
            <p>Nome mostrato: {debugReport.displayName ? "OK" : "KO"}</p>
            <p>Nome intero: {debugReport.realName ? "OK" : "KO"}</p>
            <p>Link: {debugReport.sourceUrl ? "OK" : "KO"}</p>
            <p>Shop: {debugReport.sourceShop ? "OK" : "KO"}</p>
            <p>Prezzo: {debugReport.price ? "OK" : "KO"}</p>
            <p>Immagine: {debugReport.imageUrl ? "OK" : "KO"}</p>

            <hr className="my-3 border-neutral-700" />

            <p>
              Occasioni: {debugReport.occasionsSaved}/
              {debugReport.occasionsRequested}
            </p>
            <p>
              Età: {debugReport.agesSaved}/{debugReport.agesRequested}
            </p>
            <p>
              Sessi: {debugReport.gendersSaved}/{debugReport.gendersRequested}
            </p>
            <p>
              Relazioni: {debugReport.relationshipsSaved}/
              {debugReport.relationshipsRequested}
            </p>
            <p>
              Personalità: {debugReport.personalitiesSaved}/
              {debugReport.personalitiesRequested}
            </p>
            <p>
              Categorie: {debugReport.categoriesSaved}/
              {debugReport.categoriesRequested}
            </p>
          </div>

          <button
            onClick={() => {
              setShowDebugPopup(false);
              setDebugReport(null);
            }}
            className="mt-6 w-full cursor-pointer rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-neutral-200"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

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
          price: productPrice ? Number(productPrice.replace(",", ".")) : 0,
          imageUrl: productImage || "",
          occasions: [...new Set([...selectedOccasions, ...aiOccasions])],
          ages: [...new Set([...selectedAges, ...aiAges])],
          genders: [...new Set([...selectedGenders, ...aiGenders])],
          relationships: [
            ...new Set([...selectedRelationships, ...aiRelationships]),
          ],
          personalities: [
            ...new Set([...selectedPersonalities, ...aiPersonalities]),
          ],
          categories: [...new Set([...selectedCategories, ...aiCategories])],
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
      setSelectedCategories([]);

      setAiOccasions([]);
      setAiAges([]);
      setAiGenders([]);
      setAiRelationships([]);
      setAiPersonalities([]);
      setAiCategories([]);
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
    { label: "Dipendente/i", value: "dipendente/i" },
  ];

  const personalitiesList = [
    { label: "Creativa", value: "creativa" },
    { label: "Emotiva", value: "emotiva" },
    { label: "Pratica", value: "pratica" },
  ];

  const categoriesList = [
    { label: "Tech", value: "tech" },
    { label: "Casa", value: "casa" },
    { label: "Benessere", value: "benessere" },
    { label: "Tempo libero", value: "tempo-libero" },
  ];

  const agesList = [
    { label: "0-6", value: "0-6" },
    { label: "7-12", value: "7-12" },
    { label: "13-18", value: "13-18" },
    { label: "19-25", value: "19-25" },
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
                onChange={(e) => {
                  const value = e.target.value;

                  const formatted = value
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase());

                  setName(formatted);
                }}
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
                    // 🔍 Validazione link
                    try {
                      new URL(link);
                    } catch {
                      setModalMessage("Questo non è un link valido");
                      setModalType("error");
                      return;
                    }
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
                      console.log("RISPOSTA /api/admin/elabora:", data);
                      console.log(
                        "SUGGERIMENTI AI FRONTEND:",
                        data.suggestions,
                      );

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

                      setShowNamePopup(true);

                      setAiOccasions(data.suggestions.occasions || []);
                      setAiAges(data.suggestions.ages || []);
                      setAiGenders(data.suggestions.genders || []);
                      setAiRelationships(data.suggestions.relationships || []);
                      setAiPersonalities(data.suggestions.personalities || []);
                      setAiCategories(data.suggestions.categories || []);
                      setSelectedCategories(data.suggestions.categories || []);
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
                          type="radio"
                          name="selectedGender"
                          className="sr-only"
                          checked={selectedGenders.includes(item.value)}
                          onChange={() => setSelectedGenders([item.value])}
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

      {showNamePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl text-center">
            <h2 className="mb-3 text-xl font-semibold text-white">
              Inserisci il nome intero
            </h2>

            <p className="mb-5 text-base text-neutral-300">
              Questo prodotto Amazon richiede il nome completo prima di
              continuare.
            </p>

            <input
              type="text"
              value={realProductName}
              onChange={(e) => setRealProductName(e.target.value)}
              placeholder="Nome intero prodotto"
              className="mb-5 w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-white"
            />

            <button
              type="button"
              onClick={() => {
                if (!realProductName.trim()) return;
                setShowNamePopup(false);
                setShowImagePopup(true);
              }}
              disabled={!realProductName.trim()}
              className={`w-full rounded-xl py-3 font-semibold transition ${
                realProductName.trim()
                  ? "bg-white text-black hover:bg-neutral-200 cursor-pointer"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
            >
              Conferma
            </button>
          </div>
        </div>
      )}

      {showImagePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl text-center">
            <h2 className="mb-3 text-xl font-semibold text-white">
              Inserisci immagine prodotto
            </h2>

            <p className="mb-5 text-base text-neutral-300">
              Incolla il link dell'immagine del prodotto.
            </p>

            <input
              type="file"
              accept="image/*"
              className="mb-5 w-full cursor-pointer rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-white file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-black"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                try {
                  const res = await fetch("/api/admin/upload-image", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    alert(data.error || "Errore durante upload immagine");
                    return;
                  }

                  setProductImage(data.url);
                } catch {
                  alert("Errore durante upload immagine");
                }
              }}
            />

            {productImage && (
              <div className="mb-5 overflow-hidden rounded-xl border border-green-600/40 bg-green-600/10 p-3">
                <p className="mb-3 text-sm font-medium text-green-300">
                  Immagine caricata correttamente
                </p>
                <img
                  src={productImage}
                  alt="Anteprima prodotto caricata"
                  className="mx-auto h-40 rounded-lg object-cover"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (!productImage.trim()) return;
                setShowImagePopup(false);
                setShowPricePopup(true);
              }}
              disabled={!productImage.trim()}
              className={`w-full rounded-xl py-3 font-semibold transition ${
                productImage.trim()
                  ? "bg-white text-black hover:bg-neutral-200 cursor-pointer"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
            >
              Conferma
            </button>
          </div>
        </div>
      )}

      {showPricePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl text-center">
            <h2 className="mb-3 text-xl font-semibold text-white">
              Inserisci prezzo prodotto
            </h2>

            <p className="mb-5 text-base text-neutral-300">
              Inserisci il prezzo prima di continuare.
            </p>

            <input
              type="text"
              inputMode="decimal"
              value={productPrice}
              onChange={(e) => {
                let value = e.target.value;

                // sostituisce punto con virgola
                value = value.replace(".", ",");

                setProductPrice(value);
              }}
              placeholder="Es. 24.99"
              className="mb-5 w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-white"
            />

            <button
              type="button"
              onClick={() => {
                if (!productPrice.trim()) return;

                let value = productPrice.replace(",", ".");
                let number = parseFloat(value);

                if (isNaN(number)) return;

                // forza 2 decimali
                const formatted = number.toFixed(2).replace(".", ",");

                setProductPrice(formatted);
                setShowPricePopup(false);
              }}
              disabled={!productPrice.trim()}
              className={`w-full rounded-xl py-3 font-semibold transition ${
                productPrice.trim()
                  ? "bg-white text-black hover:bg-neutral-200 cursor-pointer"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
            >
              Conferma
            </button>
          </div>
        </div>
      )}

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
