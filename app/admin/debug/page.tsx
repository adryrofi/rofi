"use client";

import { useState } from "react";

export default function AdminDebugPage() {
  const [productId, setProductId] = useState("");
  const [responseText, setResponseText] = useState("");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Debug prodotto</h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Inserisci ID prodotto"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "white",
              color: "#0f172a",
            }}
          />

          <button
            type="button"
            onClick={async () => {
              if (!productId.trim()) {
                setResponseText("Inserisci un ID prodotto.");
                return;
              }

              try {
                setResponseText("Caricamento...");

                const res = await fetch(
                  `/api/admin/debug?id=${encodeURIComponent(productId.trim())}`,
                );

                const data = await res.json();

                setResponseText(JSON.stringify(data, null, 2));
              } catch (error) {
                setResponseText("Errore durante il recupero dei dati.");
              }
            }}
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Cerca
          </button>
        </div>

        <textarea
          value={responseText}
          readOnly
          style={{
            width: "100%",
            minHeight: "500px",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "#020617",
            color: "#e5e7eb",
            fontFamily: "monospace",
            fontSize: "14px",
            resize: "vertical",
          }}
        />
      </div>
    </main>
  );
}
