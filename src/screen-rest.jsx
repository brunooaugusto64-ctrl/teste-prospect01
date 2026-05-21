// Integrações + Faturação + Settings

// =====================================================
// CONFIGURAÇÃO STRIPE — links de pagamento
// =====================================================
const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/test_9B65kDggk0kwh0fg0w53O00",
  growth: "https://buy.stripe.com/test_cNi14n0hm8R24dt3dK53O01",
  scale: "https://buy.stripe.com/test_fZu00j5BGffq9xN6pW53O02",
};

// Limites por plano (devem bater com plans.js)
const PLAN_LIMITS = {
  free: 50,
  starter: 250,
  growth: 600,
  scale: 1500,
};

// =====================================================
// INTEGRATIONS — lista limpa de integrações disponíveis
// =====================================================
const IntegrationsScreen = () => {
  const items = [
    { name: "Google Maps", icon: "map-pin", desc: "Pesquisa de leads em tempo real", soon: true },
    { name: "n8n", icon: "bolt", desc: "Automações via webhook", soon: false, configured: true },
    { name: "Notion", icon: "notion", desc: "Sync bidirecional com bases Notion", soon: true },
    { name: "Slack", icon: "bell", desc: "Notificações em canais", soon: true },
    { name: "Webhook", icon: "plug", desc: "POST events · custom endpoint", soon: true },
    { name: "HubSpot CRM", icon: "users", desc: "Sync de contactos e deals", soon: true },
    { name: "Pipedrive", icon: "users", desc: "Push leads como deals", soon: true },
    { name: "SendGrid", icon: "globe", desc: "Email outbound automático", soon: true },
  ];

  return (
    <div style={{ padding: "20px 22px 60px" }}>
      <div className="uppercase-label" style={{ marginBottom: 10 }}>Integrações disponíveis</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {items.map(it => (
          <Card key={it.name} style={{ padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 5,
                background: "var(--bg-3)", border: "1px solid var(--line-2)",
                display: "grid", placeItems: "center",
                color: it.configured ? "var(--accent)" : "var(--fg-1)",
              }}>
                <Icon name={it.icon} size={16}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{it.name}</span>
                  {it.configured && <Pill color="var(--good)"><Dot color="var(--good)" size={5}/> ativo</Pill>}
                  {it.soon && <Pill color="var(--fg-3)">em breve</Pill>}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 4 }}>{it.desc}</div>
                <button
                  disabled={it.soon}
                  style={{
                    marginTop: 10,
                    padding: "4px 10px",
                    background: it.configured ? "var(--bg-3)" : "transparent",
                    border: "1px solid var(--line-2)",
                    borderRadius: 4,
                    fontSize: 11,
                    color: it.soon ? "var(--fg-3)" : "var(--fg-1)",
                    cursor: it.soon ? "not-allowed" : "pointer",
                    opacity: it.soon ? 0.5 : 1,
                  }}
                >
                  {it.configured ? "Configurar" : it.soon ? "Em breve" : "Conectar"}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};


// =====================================================
// BILLING — agora INTEGRADO com Stripe
// =====================================================
const BillingScreen = () => {
  const [user, setUser] = React.useState(null);
  const [subscription, setSubscription] = React.useState(null);
  const [usage, setUsage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Detecta retorno do Stripe (?upgrade=success&plan=...)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgrade") === "success") {
      setShowSuccess(params.get("plan") || "starter");
      // Limpa URL depois de 100ms (pra não ficar no histórico)
      setTimeout(() => {
        window.history.replaceState({}, "", window.location.pathname);
      }, 100);
    }
  }, []);

  // Carrega user + subscription + uso
  React.useEffect(() => {
    (async () => {
      const { data: { user } } = await window.supabase.auth.getUser();
      setUser(user);
      if (!user) return;

      // Carrega subscription
      const { data: sub } = await window.supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setSubscription(sub || { plan: "free", status: "active" });

      // Conta leads dos últimos 30 dias
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count } = await window.supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo);

      setUsage(count || 0);
      setLoading(false);
    })();
  }, []);

  const handleUpgrade = (planId) => {
    const link = STRIPE_LINKS[planId];
    if (!link) {
      alert("Link de pagamento não configurado.");
      return;
    }

    // Adiciona email do user na URL pra Stripe pré-preencher
    let url = link;
    if (user?.email) {
      const sep = link.includes("?") ? "&" : "?";
      url = `${link}${sep}prefilled_email=${encodeURIComponent(user.email)}&client_reference_id=${user.id}`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const currentPlan = subscription?.plan || "free";
  const currentLimit = PLAN_LIMITS[currentPlan];
  const usagePct = (usage / currentLimit) * 100;
  const usageColor = usagePct >= 90 ? "var(--bad)" : usagePct >= 70 ? "var(--warn, #f59e0b)" : "var(--accent)";

  // Pega os planos do plans.js
  const tiers = window.PLANS ? [
    { ...window.PLANS.starter, id: "starter" },
    { ...window.PLANS.growth, id: "growth" },
    { ...window.PLANS.scale, id: "scale" },
  ] : [
    { id: "starter", name: "Starter", price: 29, description: "Para freelancers que querem parar de procurar cliente.", features: ["250 leads/mês", "Exportação CSV", "Suporte WhatsApp", "Cancela a qualquer momento"] },
    { id: "growth", name: "Growth", price: 59, description: "Para agências e times pequenos.", features: ["600 leads/mês", "5 logins de equipa", "Integração CRM básica", "Suporte prioritário"] },
    { id: "scale", name: "Scale", price: 129, description: "Para operações de escala.", features: ["1500 leads/mês", "Logins ilimitados", "Acesso à API", "Integração avançada", "Suporte dedicado"] },
  ];

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "var(--fg-2)" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.06em" }}>A CARREGAR...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 22px 60px" }}>
      {/* Mensagem de sucesso após retorno do Stripe */}
      {showSuccess && (
        <Card style={{
          marginBottom: 20, padding: "16px 20px",
          background: "color-mix(in oklab, var(--good) 8%, var(--bg-2))",
          borderColor: "color-mix(in oklab, var(--good) 50%, var(--line-2))",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "color-mix(in oklab, var(--good) 20%, var(--bg-3))",
              display: "grid", placeItems: "center",
              color: "var(--good)",
            }}>
              <Icon name="check" size={18}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Pagamento confirmado!</div>
              <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>
                A tua subscrição do plano <strong style={{ color: "var(--fg-0)" }}>{showSuccess}</strong> está a ser processada.
                O upgrade será ativado em poucos minutos. Vais receber email de confirmação do Stripe.
              </div>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                width: 28, height: 28, borderRadius: 4,
                background: "transparent", border: "1px solid var(--line-2)",
                display: "grid", placeItems: "center", color: "var(--fg-2)", cursor: "pointer",
              }}>
              <Icon name="x" size={12}/>
            </button>
          </div>
        </Card>
      )}

      {/* Card do plano ATUAL */}
      <Card style={{ marginBottom: 22, padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div className="uppercase-label" style={{ marginBottom: 6 }}>Plano atual</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <h2 style={{
                margin: 0, fontSize: 26, fontWeight: 600,
                fontFamily: "var(--font-display)", letterSpacing: "-0.015em",
                textTransform: "capitalize",
              }}>
                {currentPlan}
              </h2>
              {currentPlan === "free" && <Pill color="var(--info)">Trial</Pill>}
              {currentPlan !== "free" && <Pill color="var(--good)"><Dot color="var(--good)" size={5} pulse/> ativo</Pill>}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 6 }}>
              {currentPlan === "free"
                ? "Estás na versão gratuita. Faz upgrade para desbloquear mais leads."
                : `Plano ${currentPlan} · cancela quando quiseres no portal Stripe.`
              }
            </div>
          </div>

          {/* Uso do mês */}
          <div style={{
            minWidth: 240,
            padding: "14px 16px",
            background: "var(--bg-2)",
            border: "1px solid var(--line)",
            borderRadius: 8,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span className="uppercase-label" style={{ fontSize: 9.5 }}>Uso · 30 dias</span>
              <span className="mono tabular" style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-0)" }}>
                {usage} / {currentLimit}
              </span>
            </div>
            <div style={{
              height: 6, background: "var(--bg-1)",
              borderRadius: 3, overflow: "hidden",
            }}>
              <div style={{
                width: `${Math.min(usagePct, 100)}%`,
                height: "100%",
                background: usageColor,
                borderRadius: 3,
                transition: "width 0.6s ease-out",
                boxShadow: usagePct >= 70 ? `0 0 6px ${usageColor}` : "none",
              }}/>
            </div>
            {usagePct >= 80 && (
              <div style={{ fontSize: 10.5, color: usagePct >= 95 ? "var(--bad)" : "var(--warn, #f59e0b)", marginTop: 6 }}>
                {usagePct >= 95 ? "⚠ Limite quase atingido" : "Considera fazer upgrade"}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Pricing tiers */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
            {currentPlan === "free" ? "Escolhe o teu plano" : "Outros planos"}
          </h2>
          <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>
            Faturação mensal · cancela a qualquer momento · pagamento seguro via Stripe
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {tiers.map(t => {
          const isHighlight = t.id === "growth";
          const isCurrent = currentPlan === t.id;
          return (
            <div key={t.id} style={{
              background: isHighlight ? "color-mix(in oklab, var(--accent) 4%, var(--bg-2))" : "var(--bg-2)",
              border: "1px solid " + (isCurrent ? "var(--good)" : isHighlight ? "var(--accent)" : "var(--line)"),
              borderRadius: 10,
              padding: 22,
              position: "relative",
              opacity: isCurrent ? 0.85 : 1,
            }}>
              {isCurrent && (
                <div style={{
                  position: "absolute", top: -10, right: 16,
                  padding: "3px 9px",
                  background: "var(--good)", color: "#fff",
                  borderRadius: 4,
                  fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
                }}>plano atual</div>
              )}
              {!isCurrent && isHighlight && (
                <div style={{
                  position: "absolute", top: -10, right: 16,
                  padding: "3px 9px",
                  background: "var(--accent)", color: "var(--accent-fg)",
                  borderRadius: 4,
                  fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
                }}>recomendado</div>
              )}
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-display)" }}>{t.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-2)", marginTop: 4 }}>{t.description}</div>
              <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 14, color: "var(--fg-2)", fontWeight: 500 }}>R$</span>
                <span className="tabular" style={{ fontSize: 36, fontWeight: 500, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1 }}>{t.price}</span>
                <span style={{ fontSize: 12, color: "var(--fg-2)" }}>/mês</span>
              </div>
              <Btn
                variant={isCurrent ? "outline" : isHighlight ? "primary" : "secondary"}
                size="md"
                disabled={isCurrent}
                onClick={() => handleUpgrade(t.id)}
                style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
              >
                {isCurrent ? "Plano atual" : `Subscrever ${t.name}`}
              </Btn>
              <div style={{ height: 1, background: "var(--line)", margin: "20px 0" }}/>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {t.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--fg-1)" }}>
                    <Icon name="check" size={13} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}/>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer com info de segurança */}
      <div style={{
        marginTop: 24,
        padding: "14px 18px",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="shield" size={14} style={{ color: "var(--good)" }}/>
          <span style={{ fontSize: 11.5, color: "var(--fg-1)" }}>Pagamento seguro Stripe</span>
        </div>
        <span style={{ color: "var(--fg-3)" }}>·</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="card" size={14} style={{ color: "var(--accent)" }}/>
          <span style={{ fontSize: 11.5, color: "var(--fg-1)" }}>Visa · Mastercard · American Express</span>
        </div>
        <span style={{ color: "var(--fg-3)" }}>·</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="check" size={14} style={{ color: "var(--good)" }}/>
          <span style={{ fontSize: 11.5, color: "var(--fg-1)" }}>Cancela quando quiseres</span>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// SETTINGS — equipa real, API placeholder, preferências
// =====================================================
const SettingsScreen = () => {
  const tabs = ["Conta", "API & Webhooks", "Preferências"];
  const [tab, setTab] = React.useState(0);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    window.supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <div style={{ padding: "0 22px 60px" }}>
      <div style={{
        display: "flex", gap: 4,
        borderBottom: "1px solid var(--line)",
        marginBottom: 22,
        position: "sticky", top: 0, background: "var(--bg-1)", paddingTop: 18, zIndex: 5,
      }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: "10px 14px",
            background: "transparent", border: "none",
            borderBottom: "2px solid " + (tab === i ? "var(--accent)" : "transparent"),
            color: tab === i ? "var(--fg-0)" : "var(--fg-2)",
            fontSize: 12.5, fontWeight: tab === i ? 500 : 400,
            marginBottom: -1,
            cursor: "pointer",
          }}>{t}</button>
        ))}
      </div>

      {/* Tab Conta */}
      {tab === 0 && (
        <Card padded>
          <div className="uppercase-label" style={{ marginBottom: 14 }}>Conta</div>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px 16px", fontSize: 12.5 }}>
            <span style={{ color: "var(--fg-2)" }}>Nome</span>
            <span>{user?.user_metadata?.full_name || "—"}</span>
            <span style={{ color: "var(--fg-2)" }}>Email</span>
            <span className="mono">{user?.email || "—"}</span>
            <span style={{ color: "var(--fg-2)" }}>ID do utilizador</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{user?.id || "—"}</span>
            <span style={{ color: "var(--fg-2)" }}>Criado em</span>
            <span className="mono">{user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-PT") : "—"}</span>
          </div>
          <div style={{ height: 1, background: "var(--line)", margin: "20px 0" }}/>
          <div className="uppercase-label" style={{ marginBottom: 8, color: "var(--bad)" }}>Zona de perigo</div>
          <Btn variant="danger" size="sm" icon="trash" onClick={() => alert("Funcionalidade em breve.")}>
            Apagar conta
          </Btn>
        </Card>
      )}

      {/* Tab API & Webhooks */}
      {tab === 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card padded>
            <div className="uppercase-label">API Keys</div>
            <p style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 6 }}>
              Em breve poderás gerar chaves de API para integrar com sistemas externos.
            </p>
            <Btn size="sm" variant="outline" icon="plus" disabled style={{ marginTop: 10 }}>
              Em breve
            </Btn>
          </Card>
          <Card padded>
            <div className="uppercase-label">Webhooks</div>
            <p style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 6 }}>
              Em breve poderás configurar webhooks para receber eventos em tempo real.
            </p>
            <Btn size="sm" variant="outline" icon="plus" disabled style={{ marginTop: 10 }}>
              Em breve
            </Btn>
          </Card>
        </div>
      )}

      {/* Tab Preferências */}
      {tab === 2 && (
        <Card padded>
          <div className="uppercase-label" style={{ marginBottom: 12 }}>Preferências</div>
          {[
            { l: "Notificações por email", d: "Receber resumo semanal de leads novos", on: true },
            { l: "Re-scoring automático", d: "Recalcular scores semanalmente", on: false },
          ].map((p, i, arr) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{p.l}</div>
                <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 2 }}>{p.d}</div>
              </div>
              <Toggle on={p.on} onChange={() => alert("Em breve.")}/>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// AutomationsScreen é deprecated — não tinha sentido com dados fake
const AutomationsScreen = () => (
  <div style={{ padding: 60, textAlign: "center" }}>
    <Icon name="bolt" size={32} style={{ color: "var(--fg-3)" }}/>
    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 14 }}>Automações em breve</div>
    <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>
      Configura gatilhos e ações personalizadas a partir do plano Growth.
    </div>
  </div>
);

Object.assign(window, { IntegrationsScreen, AutomationsScreen, BillingScreen, SettingsScreen });
