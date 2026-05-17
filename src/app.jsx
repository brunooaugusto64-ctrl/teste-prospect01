import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  const [session, setSession] = React.useState(null);
  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    window.supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });

    const { data: { subscription } } = window.supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "SIGNED_OUT") {
        // Logout → força reload completo da landing
        window.location.replace("/index.html?logout=1");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!authChecked) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg-1)",
        color: "var(--fg-2)",
        fontFamily: "var(--font-mono)",
        fontSize: 12
      }}>
        a inicializar...
      </div>
    );
  }

  // Se não há sessão → mostra LoginScreen (não redireciona, evita loops)
  if (!session) {
    return <LoginScreen />;
  }

  return <Dashboard />;
};

const Dashboard = () => {
  const [current, setCurrent] = React.useState("overview");
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [extractOpen, setExtractOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen(o => !o); }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") { e.preventDefault(); setExtractOpen(true); }
      if (e.key === "Escape") { setPaletteOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    const onNavigate = (e) => {
      const screen = e.detail?.screen;
      if (screen) {
        setCurrent(screen);
      }
    };
    window.addEventListener("navigate", onNavigate);
    return () => window.removeEventListener("navigate", onNavigate);
  }, []);

  const TITLES = {
    overview: { title: "Overview", subtitle: "Telemetria do workspace", crumb: "WORKSPACE / DASHBOARD" },
    leads: { title: "Leads", subtitle: "Lista de leads gerados", crumb: "WORKSPACE / LEADS" },
    extract: { title: "Extrair leads", subtitle: "Prompt-driven · Google Maps", crumb: "WORKSPACE / EXTRACT" },
    funnel: { title: "Funil", subtitle: "Pipeline de conversão", crumb: "WORKSPACE / FUNNEL" },
    scoring: { title: "AI Scoring", subtitle: "Modelo híbrido · regras + AI", crumb: "WORKSPACE / SCORING" },
    integrations: { title: "Integrações", subtitle: "Notion, Google Maps, Slack, webhooks", crumb: "WORKSPACE / INTEGRATIONS" },
    marketplace: { title: "Templates", subtitle: "Templates de landing pages", crumb: "WORKSPACE / TEMPLATES" },
    billing: { title: "Faturação", subtitle: "Plano e subscrição", crumb: "WORKSPACE / BILLING" },
    settings: { title: "Definições", subtitle: "Equipa, API, preferências", crumb: "WORKSPACE / SETTINGS" },
  };

  const onNav = (id) => {
    if (id === "extract") { setExtractOpen(true); return; }
    setCurrent(id);
  };

  const handleLogout = async () => {
    if (confirm("Tem certeza que quer sair?")) {
      await window.supabase.auth.signOut();
    }
  };

  const t = TITLES[current];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-1)" }}>
      <Sidebar current={current} onNav={onNav} onLogout={handleLogout}/>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <LiveTicker/>
        <TopBar
          title={t.title}
          subtitle={t.subtitle}
          breadcrumb={t.crumb}
          onCmd={() => setPaletteOpen(true)}
          actions={current === "overview" ? null : null}
        />
        <main style={{ flex: 1 }}>
          {current === "overview" && <OverviewScreen onOpenExtract={() => setExtractOpen(true)}/>}
          {current === "leads" && <LeadsScreen onOpenLead={setSelectedLead} onOpenExtract={() => setExtractOpen(true)}/>}
          {current === "funnel" && <FunnelScreen/>}
          {current === "scoring" && <ScoringScreen/>}
          {current === "integrations" && <IntegrationsScreen/>}
          {current === "marketplace" && <MarketplaceScreen/>}
          {current === "billing" && <BillingScreen/>}
          {current === "settings" && <SettingsScreen/>}
        </main>
      </div>

      <ExtractModal open={extractOpen} onClose={() => setExtractOpen(false)} onComplete={() => setCurrent("leads")}/>
      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)}/>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNav={setCurrent} onExtract={() => setExtractOpen(true)}/>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
