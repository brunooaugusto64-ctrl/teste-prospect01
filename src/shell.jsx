// App Shell — sidebar + topbar

// App Shell — sidebar + topbar

const PLAN_LIMITS_SHELL = {
  free: 50,
  starter: 250,
  growth: 600,
  scale: 1500,
};

const PLAN_LABELS_SHELL = {
  free: "Trial",
  starter: "Starter",
  growth: "Growth",
  scale: "Scale",
};

const PLAN_COLORS_SHELL = {
  free: "var(--info)",
  starter: "var(--accent)",
  growth: "var(--good)",
  scale: "var(--accent)",
};

const NAV_ITEMS = [

const Sidebar = ({ current, onNav, onLogout }) => {
  const [user, setUser] = React.useState(null);
  const [subscription, setSubscription] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const { data: { user } } = await window.supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: sub } = await window.supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("user_id", user.id)
          .maybeSingle();
        setSubscription(sub || { plan: "free", status: "active" });
      }
    })();
  }, []);

  const planKey = subscription?.plan || "free";
  const planLabel = PLAN_LABELS_SHELL[planKey] || "Trial";
  const planColor = PLAN_COLORS_SHELL[planKey] || "var(--info)";
  const planLimit = PLAN_LIMITS_SHELL[planKey] || 50;

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "··";

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "carregando...";
  const displayEmail = user?.email || "...";

  return (
    <aside style={{
      width: 220,
      height: "100vh",
      background: "var(--bg-0)",
      borderRight: "1px solid var(--line)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "sticky",
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "18px 16px 14px",
        borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 26, height: 26,
          background: "var(--accent)",
          borderRadius: 5,
          display: "grid", placeItems: "center",
          color: "var(--accent-fg)",
          position: "relative",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2 L4 7 L12 12 L20 7 Z"/>
            <path d="M4 12 L12 17 L20 12"/>
            <path d="M4 17 L12 22 L20 17"/>
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>Prospect IA</span>
          <span className="mono" style={{ fontSize: 9.5, color: "var(--fg-2)", letterSpacing: "0.06em" }}>v0.1 · BETA</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 8px 8px", flex: 1, overflowY: "auto" }}>
        <div className="uppercase-label" style={{ padding: "8px 8px 4px" }}>Workspace</div>
        {NAV_ITEMS.map(item => {
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", gap: 10,
                padding: "7px 10px",
                background: active ? "var(--bg-3)" : "transparent",
                border: "1px solid " + (active ? "var(--line-2)" : "transparent"),
                borderRadius: 5,
                color: active ? "var(--fg-0)" : "var(--fg-1)",
                fontSize: 12.5,
                marginBottom: 1,
                position: "relative",
                textAlign: "left",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-2)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {active && (
                <span style={{
                  position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)",
                  width: 2, height: 14, background: "var(--accent)", borderRadius: 2,
                }}/>
              )}
              <Icon name={item.icon} size={14} style={{ color: active ? "var(--accent)" : "var(--fg-2)" }}/>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.accent && <Kbd>⌘N</Kbd>}
            </button>
          );
        })}
      </nav>

      {/* Plano — dinâmico baseado em subscription */}
      <div style={{
        padding: 12,
        borderTop: "1px solid var(--line)",
        background: "var(--bg-1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="uppercase-label">Plano</span>
          <Pill color={planColor}>{planLabel}</Pill>
        </div>
        <div style={{ marginTop: 6, fontSize: 10.5, color: "var(--fg-2)", lineHeight: 1.4 }}>
          {planKey === "free"
            ? "Faz upgrade para desbloquear todos os recursos."
            : `${planLimit} leads/mês · cancela quando quiseres.`
          }
        </div>
      </div>

      {/* User */}
      <div style={{
        padding: "10px 12px",
        borderTop: "1px solid var(--line)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: "linear-gradient(135deg, oklch(0.6 0.15 30), oklch(0.5 0.18 60))",
          display: "grid", placeItems: "center",
          fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "#fff",
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
          <div style={{ fontSize: 10.5, color: "var(--fg-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayEmail}</div>
        </div>
        <button
          onClick={onLogout}
          title="Sair"
          style={{
            padding: 4,
            background: "transparent",
            border: "none",
            color: "var(--fg-2)",
            cursor: "pointer",
            borderRadius: 4,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-3)";
            e.currentTarget.style.color = "var(--bad)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--fg-2)";
          }}
        >
          <Icon name="logout" size={14}/>
        </button>
      </div>
    </aside>
  );
};

const TopBar = ({ title, subtitle, actions, breadcrumb, onCmd }) => (
  <header style={{
    height: 56,
    borderBottom: "1px solid var(--line)",
    background: "var(--bg-1)",
    display: "flex", alignItems: "center",
    padding: "0 22px",
    gap: 16,
    position: "sticky", top: 0, zIndex: 20,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      {breadcrumb && (
        <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-2)", marginBottom: 1, letterSpacing: "0.04em" }}>
          {breadcrumb}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: 17, fontWeight: 600, margin: 0,
          letterSpacing: "-0.01em",
        }}>{title}</h1>
        {subtitle && <span style={{ fontSize: 12, color: "var(--fg-2)" }}>{subtitle}</span>}
      </div>
    </div>
    <TopBarSearch onCmd={onCmd}/>
    <button style={{
      width: 30, height: 30, display: "grid", placeItems: "center",
      background: "transparent", border: "1px solid var(--line)", borderRadius: 5,
      color: "var(--fg-1)", position: "relative",
      cursor: "pointer",
    }}>
      <Icon name="bell" size={14}/>
    </button>
    {actions}
  </header>
);

// Live ticker — telemetry feel at the very top
const LiveTicker = () => {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const tt = time.toLocaleTimeString("pt-PT");
  return (
    <div style={{
      height: 22,
      background: "var(--bg-0)",
      borderBottom: "1px solid var(--line)",
      display: "flex", alignItems: "center",
      padding: "0 16px",
      gap: 18,
      fontFamily: "var(--font-mono)",
      fontSize: 10, color: "var(--fg-2)",
      letterSpacing: "0.04em",
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Dot color="var(--good)" size={5} pulse/>
        SISTEMA ONLINE
      </span>
      <span style={{ flex: 1 }}/>
      <span className="tabular">{tt}</span>
    </div>
  );
};

Object.assign(window, { Sidebar, TopBar, LiveTicker, NAV_ITEMS });
