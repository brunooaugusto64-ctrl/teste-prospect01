// Funnel + Scoring screens — DESATIVADAS
// As telas "Funil" e "AI Scoring" foram removidas do produto pois não fazem sentido
// pro propósito do SaaS (geração de leads via IA, não CRM de vendas).
//
// Este arquivo existe apenas para o main.jsx não dar erro 404.
// Os componentes ainda são exportados como placeholders vazios caso algo
// no roteamento ainda os referencie — basta remover a aba do shell.jsx
// e do app.jsx pra não aparecerem mais no menu.

const FunnelScreen = () => (
  <div style={{
    padding: 60,
    textAlign: "center",
    color: "var(--fg-2)",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
  }}>
    Esta tela foi removida.
  </div>
);

const ScoringScreen = () => (
  <div style={{
    padding: 60,
    textAlign: "center",
    color: "var(--fg-2)",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
  }}>
    Esta tela foi removida.
  </div>
);

window.FunnelScreen = FunnelScreen;
window.ScoringScreen = ScoringScreen;
