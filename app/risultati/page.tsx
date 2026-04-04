import Link from "next/link";
import { getTopProducts } from "../../lib/scoring";
import ProductCard from "../components/ProductCard";

export default async function Risultati({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;

  const budgetOrder = ["1-20", "20-30", "30-50", "50-100", "100+"];
  const currentBudgetIndex = budgetOrder.indexOf(params?.budget);
  const currentPage = Number(params?.page || 1);

  const higherBudget =
    currentBudgetIndex >= 0 && currentBudgetIndex < budgetOrder.length - 1
      ? budgetOrder[currentBudgetIndex + 1]
      : null;

  const lowerBudget =
    currentBudgetIndex > 0 ? budgetOrder[currentBudgetIndex - 1] : null;

  const unisexGender =
    params?.gender && params.gender !== "Unisex" ? "Unisex" : null;

  const products = await getTopProducts({
    occasion: params?.occasion,
    relationship: params?.relationship,
    age: params?.age,
    personality: params?.personality,
    gender: params?.gender,
    budget: params?.budget,
    page: currentPage,
  });

  const uniqueProducts = products.filter((product, index, self) => {
    if (product.isPlaceholder) return true;
    return index === self.findIndex((p) => p.link === product.link);
  });

  const realProductsCount = uniqueProducts.filter(
    (p) => !p.isPlaceholder,
  ).length;

  console.log("PRIMO PRODOTTO", products[0]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      {/* TITOLO PAGINA */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "32px",
          letterSpacing: "1px",
        }}
      >
        La selezione di Rofi
      </h1>

      <p
        style={{
          textAlign: "center",
          marginTop: "-25px",
          marginBottom: "40px",
          fontSize: "18px",
          letterSpacing: "0.5px",
          fontWeight: "600",
          opacity: 0.9,
        }}
      >
        Le proposte più adatte per questa occasione
      </p>

      {realProductsCount < 3 && (
        <p
          style={{
            textAlign: "center",
            marginTop: "-20px",
            marginBottom: "30px",
            fontSize: "14px",
            opacity: 0.7,
          }}
        >
          Stiamo migliorando le proposte per questa combinazione 👀
        </p>
      )}

      <div
        style={{
          width: "60px",
          height: "3px",
          background: "#f8f6f2",
          margin: "0 auto 40px auto",
          borderRadius: "2px",
          opacity: 0.6,
        }}
      ></div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        {lowerBudget && (
          <Link
            replace
            href={`/risultati?occasion=${encodeURIComponent(params?.occasion || "")}&relationship=${encodeURIComponent(params?.relationship || "")}&age=${encodeURIComponent(params?.age || "")}&personality=${encodeURIComponent(params?.personality || "")}&budget=${encodeURIComponent(lowerBudget)}&gender=${encodeURIComponent(params?.gender || "")}&page=1`}
            style={{
              padding: "10px 16px",
              background: "white",
              color: "#0f172a",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            - Prezzo
          </Link>
        )}

        {higherBudget && (
          <Link
            replace
            href={`/risultati?occasion=${encodeURIComponent(params?.occasion || "")}&relationship=${encodeURIComponent(params?.relationship || "")}&age=${encodeURIComponent(params?.age || "")}&personality=${encodeURIComponent(params?.personality || "")}&budget=${encodeURIComponent(higherBudget)}&gender=${encodeURIComponent(params?.gender || "")}&page=1`}
            style={{
              padding: "10px 16px",
              background: "white",
              color: "#0f172a",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            + Prezzo
          </Link>
        )}

        {unisexGender && (
          <Link
            replace
            href={`/risultati?occasion=${encodeURIComponent(params?.occasion || "")}&relationship=${encodeURIComponent(params?.relationship || "")}&age=${encodeURIComponent(params?.age || "")}&personality=${encodeURIComponent(params?.personality || "")}&budget=${encodeURIComponent(params?.budget || "")}&gender=${encodeURIComponent(unisexGender)}&page=1`}
            style={{
              padding: "10px 16px",
              background: "white",
              color: "#0f172a",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Vedi anche Unisex
          </Link>
        )}

        <Link
          replace
          href={`/risultati?occasion=${encodeURIComponent(params?.occasion || "")}&relationship=${encodeURIComponent(params?.relationship || "")}&age=${encodeURIComponent(params?.age || "")}&personality=${encodeURIComponent(params?.personality || "")}&budget=${encodeURIComponent(params?.budget || "")}&gender=${encodeURIComponent(params?.gender || "")}&page=${currentPage + 1}`}
          style={{
            padding: "10px 16px",
            background: "#0f172a",
            color: "white",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
            border: "1px solid white",
          }}
        >
          Cerca altri regali
        </Link>
      </div>

      {/* CONTENITORE GENERALE DI TUTTE LE CARD */}
      <div
        style={{
          maxWidth: "1020px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* =========================
            PRIMA CARD / CARD PRINCIPALE
            ========================= */}
        <a
          href={uniqueProducts[0].link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            gridColumn: "1 / -1",
            background: "linear-gradient(180deg, #f8f6f2 0%, #f1efe9 100%)",
            color: "#0f172a",
            padding: "12px 30px 30px 30px",
            textAlign: "center",
            width: "100%",
            maxWidth: "540px",
            margin: "0 auto",
            borderRadius: "20px",
            transition: "transform 0.15s ease",
            cursor: "pointer",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            border: "1px solid rgba(15,23,42,0.08)",
            textDecoration: "none",
            display: "block",
          }}
        >
          {/* TITOLO DELLA CARD PRINCIPALE */}
          <div
            style={{
              display: "inline-block",
              background: "#0f172a",
              color: "white",
              padding: "5px 12px",
              borderRadius: "11px",
              fontSize: "12px",
              marginBottom: "15px",
            }}
          >
            ⭐ Consigliato per te
          </div>

          {/* IMMAGINE DELLA PRIMA CARD */}
          <img
            src={uniqueProducts[0].image || undefined}
            alt={uniqueProducts[0].name}
            style={{
              display: "block",
              width: "100%",
              height: "280px",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "15px",
            }}
          />

          {/* NOME PRODOTTO DELLA PRIMA CARD */}
          <h3
            style={{ fontSize: "20px", marginBottom: "12px", marginTop: "5px" }}
          >
            {uniqueProducts[0].name}
          </h3>

          {/* PREZZO DELLA PRIMA CARD */}
          <p
            style={{
              fontSize: "20px",
              fontWeight: "700",
              marginTop: "6px",
              letterSpacing: "0.3px",
            }}
          >
            {typeof products[0]?.price === "number"
              ? products[0].price.toFixed(2).replace(".", ",")
              : ""}{" "}
            €
          </p>
        </a>

        {/* =========================
          CARD AUTOMATICHE
            ========================= */}

        {uniqueProducts.slice(1, 5).map((product, index) => (
          <ProductCard key={`${product.link}-${index}`} product={product} />
        ))}
      </div>
    </main>
  );
}
