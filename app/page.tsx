export default function Home() {
  return (
    <main style={{ 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
      color: "white",
      fontFamily: "Arial"
    }}>
      <div style={{
        textAlign: "center",
        background: "rgba(255,255,255,0.05)",
        padding: "40px",
        borderRadius: "12px",
        maxWidth: "600px"
      }}>
        <h1 style={{fontSize: "42px", marginBottom: "10px"}}>Rofi</h1>

        <p style={{marginBottom: "25px"}}>
          Rispondi a 5 domande veloci e trova il regalo perfetto.
        </p>

        <a
          href="/start"
          style={{
            background: "white",
            color: "#0f172a",
            padding: "12px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Trova un regalo
        </a>
      </div>
    </main>
  );
}