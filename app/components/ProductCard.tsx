"use client";

type ProductCardProps = {
  product: {
    name: string;
    price?: number;
    image?: string | null;
    link?: string;
    isPlaceholder?: boolean;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  if (product.isPlaceholder) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%)",
          padding: "20px",
          textAlign: "center",
          borderRadius: "16px",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "140px",
            borderRadius: "12px",
            marginBottom: "10px",
            background: "linear-gradient(180deg, #f8f6f2 0%, #ece8df 100%)",
            color: "#0f172a",
            fontSize: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🎁
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "16px",
              minHeight: "48px",
            }}
          >
            Rofi sta cercando nuove idee
          </h3>

          <p
            style={{
              fontSize: "17px",
              fontWeight: "600",
              marginTop: "8px",
              opacity: 0.85,
            }}
          >
            Torna tra poco
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginTop: "6px",
            opacity: 0.7,
            fontSize: "13px",
          }}
        >
          Stiamo preparando proposte compatibili
        </div>
      </div>
    );
  }

  const safeLink = product.link || "#";

  let shopName = "Shop";

  try {
    const shop = new URL(safeLink).hostname.replace("www.", "").split(".")[0];
    shopName = shop.charAt(0).toUpperCase() + shop.slice(1);
  } catch {
    shopName = "Shop";
  }

  return (
    <a
      href={safeLink}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0 18px 30px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%)",
        padding: "20px",
        textAlign: "center",
        borderRadius: "16px",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.15)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <img
        src={product.image || undefined}
        alt={product.name}
        style={{
          display: "block",
          width: "100%",
          height: "140px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "10px",
        }}
      />

      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: "16px",
            minHeight: "48px",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: "17px",
            fontWeight: "600",
            marginTop: "8px",
            opacity: 0.85,
          }}
        >
          {product.price} €
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginTop: "6px",
          opacity: 0.7,
          fontSize: "13px",
        }}
      >
        Disponibile su {shopName}
      </div>
    </a>
  );
}
