export default function Home() {
  return (
    <main style={{ padding: "4rem", maxWidth: "920px", margin: "0 auto" }}>
      <p style={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>
        LEARNQUEST
      </p>
      <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 1, margin: 0 }}>
        La evolución autónoma de Classcraft.
      </h1>
      <p style={{ fontSize: "1.25rem", lineHeight: 1.6, color: "#cbd5e1" }}>
        Una base inicial para diseñar experiencias educativas gamificadas,
        adaptativas y colaborativas con apoyo de agentes de IA.
      </p>
    </main>
  );
}
