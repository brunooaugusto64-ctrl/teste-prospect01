// Overview screen — REDESIGN minimalista clean (Stripe/Linear)
// Foco no propósito real: geração de leads via IA

// ===================================================================
// LIMITES DOS PLANOS
// ===================================================================
const PLAN_LIMITS = {
  free: { name: "Free", limit: 50, color: "var(--fg-2)" },
  starter: { name: "Starter", limit: 250, color: "var(--info)" },
  growth: { name: "Growth", limit: 600, color: "var(--accent)" },
  scale: { name: "Scale", limit: 1500, color: "var(--good)" },
};

// ===================================================================
// KPI CARD — minimalista, com sub-info pequeno e barra de progresso opcional
// ===================================================================
const KpiCard = ({ label, value, sub, progress, progressColor, accent }) => (
  <div style={{
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "16px 18px",
    position: "relative",
    overflow: "hidden",
    transition: "border-color 0.2s",
  }}>
    {/* Label superior */}
    <div className="uppercase-label" style={{ fontSize: 10, letterSpacing: "0.06em" }}>
      {label}
    </div>

    {/* Valor principal */}
    <div style={{
      fontFamily: "var(--font-display)",
      fontSize: 32,
      fontWeight: 500,
      letterSpacing: "-0.02em",
      lineHeight: 1,
      marginTop: 10,
      color: accent ? "var(--accent)" : "var(--fg-0)",
    }} className="tabular">
      {value}
    </div>

    {/* Sub-info */}
    {sub && (
      <div style={{
        fontSize: 11,
        color: "var(--fg-2)",
        marginTop: 8,
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.02em",
      }}>
        {sub}
      </div>
    )}

    {/* Barra de progresso opcional */}
    {progress != null && (
      <div style={{
        marginTop: 12,
        height: 4,
        background: "var(--bg-1)",
        borderRadius: 2,
        overflow: "hidden",
      }}>
        <div style={{
          width: `${Math.min(progress, 100)}%`,
          height: "100%",
          background: progressColor || "var(--accent)",
          transition: "width 0.6s ease-out",
          borderRadius: 2,
        }}/>
      </div>
    )}
  </div>
);


// ===================================================================
// EMPTY STATE — quando não tem leads ainda
// ===================================================================
const EmptyStateCard = ({ onOpenExtract }) => (
  <div style={{
    padding: "60px 24px",
    background: "var(--bg-2)",
    border: "1px dashed var(--line-2)",
    borderRadius: 10,
    textAlign: "center",
    marginBottom: 16,
  }}>
    <div style={{
      width: 48, height: 48,
      margin: "0 auto 16px",
      borderRadius: 10,
      background: "color-mix(in oklab, var(--accent) 12%, var(--bg-3))",
      border: "1px solid color-mix(in oklab, var(--accent) 30%, var(--line-2))",
      display: "grid", placeItems: "center",
      color: "var(--accent)",
    }}>
      <Icon name="search" size={22}/>
    </div>
    <div style={{
      fontSize: 15,
      fontWeight: 500,
      fontFamily: "var(--font-display)",
      marginBottom: 6,
    }}>Ainda não tens leads</div>
    <div style={{
      fontSize: 12.5,
      color: "var(--fg-2)",
      maxWidth: 380,
      margin: "0 auto 18px",
      lineHeight: 1.5,
    }}>
      Cria a tua primeira extração para começar a capturar leads do Google Maps.
    </div>
    <Btn variant="primary" size="md" icon="search" onClick={onOpenExtract}>
      Criar primeira extração
    </Btn>
    <div style={{
      marginTop: 20,
      fontSize: 10.5,
      color: "var(--fg-3)",
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.04em",
    }}>
      ⌘N · ATALHO
    </div>
  </div>
);


// ===================================================================
// QUALIDADE DOS LEADS — anel circular minimalista (estilo Apple Watch)
// ===================================================================
const QualityRing = ({ leads }) => {
  // Calcula proporções
  const total = leads.length;
  const withPhone = leads.filter(l => l.phone && l.phone.trim()).length;
  const withWebsite = leads.filter(l => l.website && l.website.trim()).length;
  const withBoth = leads.filter(l => l.phone && l.website).length;

  // Score de qualidade: % com pelo menos um contacto (telefone ou site)
  const withContact = leads.filter(l => (l.phone && l.phone.trim()) || (l.website && l.website.trim())).length;
  const qualityPct = total > 0 ? (withContact / total) * 100 : 0;

  // Ring math
  const size = 160;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (qualityPct / 100) * circumference;

  return (
    <div style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Qualidade dos leads</h3>
          <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 2 }}>
            % com contacto válido (telefone ou website)
          </div>
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 24,
        padding: "8px 0",
      }}>
        {/* Ring */}
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            {/* Background ring */}
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke="var(--bg-1)"
              strokeWidth={stroke}
            />
            {/* Progress ring */}
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 0.8s ease-out",
                filter: "drop-shadow(0 0 6px var(--accent))",
              }}
            />
          </svg>
          {/* Centro com número */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--fg-0)",
              lineHeight: 1,
            }} className="tabular">
              {Math.round(qualityPct)}%
            </div>
            <div style={{
              fontSize: 10,
              color: "var(--fg-2)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginTop: 4,
            }}>
              QUALIDADE
            </div>
          </div>
        </div>

        {/* Stats à direita */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <QualityStat
            color="var(--accent)"
            label="Com telefone"
            value={withPhone}
            total={total}
          />
          <QualityStat
            color="var(--info)"
            label="Com website"
            value={withWebsite}
            total={total}
          />
          <QualityStat
            color="var(--good)"
            label="email"
            value={withBoth}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

const QualityStat = ({ color, label, value, total }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 5,
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11.5, color: "var(--fg-1)",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }}/>
          {label}
        </span>
        <span className="mono tabular" style={{ fontSize: 12, color: "var(--fg-0)", fontWeight: 500 }}>
          {value} <span style={{ color: "var(--fg-3)", fontSize: 10.5 }}>/ {total}</span>
        </span>
      </div>
      <div style={{
        height: 3, background: "var(--bg-1)", borderRadius: 2, overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: color, borderRadius: 2,
          transition: "width 0.6s ease-out",
        }}/>
      </div>
    </div>
  );
};


// ===================================================================
// TOP CIDADES — barras horizontais com glow (estilo Linear)
// ===================================================================
const TopCities = ({ leads }) => {
  // Conta por cidade
  const cityCounts = {};
  leads.forEach(l => {
    if (!l.city) return;
    const city = l.city.trim();
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  // Top 5
  const sorted = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const max = sorted[0]?.[1] || 1;

  return (
    <div style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Top cidades</h3>
          <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 2 }}>
            Onde tu mais geras leads
          </div>
        </div>
        {sorted.length > 0 && (
          <div className="mono" style={{ fontSize: 11, color: "var(--fg-2)" }}>
            {Object.keys(cityCounts).length} cidade{Object.keys(cityCounts).length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <div style={{
          padding: "30px 0",
          textAlign: "center",
          color: "var(--fg-3)",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
        }}>
          Aguardando dados
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map(([city, count], i) => {
            const pct = (count / max) * 100;
            const isFirst = i === 0;
            return (
              <div key={city}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  marginBottom: 5,
                }}>
                  <span style={{
                    fontSize: 12.5, color: "var(--fg-0)",
                    fontWeight: isFirst ? 500 : 400,
                  }}>
                    {city}
                  </span>
                  <span className="mono tabular" style={{
                    fontSize: 11.5,
                    color: isFirst ? "var(--accent)" : "var(--fg-1)",
                    fontWeight: 500,
                  }}>
                    {count}
                  </span>
                </div>
                <div style={{
                  height: 5,
                  background: "var(--bg-1)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: isFirst
                      ? "linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 70%, transparent))"
                      : "var(--line-3)",
                    boxShadow: isFirst ? "0 0 8px color-mix(in oklab, var(--accent) 60%, transparent)" : "none",
                    borderRadius: 3,
                    transition: "width 0.6s ease-out",
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// ===================================================================
// EXTRAÇÕES RECENTES
// ===================================================================
const RecentExtractions = ({ extractions, onOpenExtract }) => (
  <div style={{ padding: 0 }}>
    <div style={{
      padding: "16px 20px 14px",
      borderBottom: "1px solid var(--line)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Extrações recentes</h3>
        <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 2 }}>
          Histórico de prompts enviados
        </div>
      </div>
      <Btn variant="primary" size="sm" icon="plus" onClick={onOpenExtract}>Nova</Btn>
    </div>
    {!extractions || extractions.length === 0 ? (
      <div style={{
        padding: "40px 20px",
        textAlign: "center",
        color: "var(--fg-3)",
        fontSize: 12,
        fontFamily: "var(--font-mono)",
      }}>
        Nenhuma extração ainda
      </div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {extractions.slice(0, 5).map((e, i) => (
          <div key={e.id || i} style={{
            padding: "12px 20px",
            borderBottom: i < Math.min(extractions.length, 5) - 1 ? "1px solid var(--line)" : "none",
            display: "flex", alignItems: "center", gap: 12,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: "color-mix(in oklab, var(--accent) 10%, var(--bg-2))",
              border: "1px solid color-mix(in oklab, var(--accent) 25%, var(--line-2))",
              display: "grid", placeItems: "center",
              color: "var(--accent)",
              flexShrink: 0,
            }}>
              <Icon name="search" size={12}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12.5, color: "var(--fg-0)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {e.prompt || "Sem descrição"}
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-2)", marginTop: 2 }}>
                {e.created_at ? formatTimeAgo(new Date(e.created_at)) : ""}
              </div>
            </div>
            {e.leads_count != null && (
              <span className="mono tabular" style={{
                fontSize: 11, color: "var(--accent)", fontWeight: 500,
              }}>
                {e.leads_count}
              </span>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);


// ===================================================================
// ATIVIDADE LIVE
// ===================================================================
const ActivityFeed = ({ leads }) => {
  // Pega últimos 5 leads ordenados por created_at
  const recent = [...leads]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div style={{ padding: 0 }}>
      <div style={{
        padding: "16px 20px 14px",
        borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Atividade</h3>
          <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 2 }}>
            Últimos leads recebidos
          </div>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 10, color: "var(--good)",
          fontFamily: "var(--font-mono)", letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--good)",
            boxShadow: "0 0 6px var(--good)",
            animation: "pulse-soft 1.6s ease-in-out infinite",
          }}/>
          Live
        </span>
      </div>

      {recent.length === 0 ? (
        <div style={{
          padding: "40px 20px",
          textAlign: "center",
          color: "var(--fg-3)",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
        }}>
          Sem atividade ainda
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {recent.map((lead, i) => (
            <div key={lead.id} style={{
              padding: "12px 20px",
              borderBottom: i < recent.length - 1 ? "1px solid var(--line)" : "none",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 6px var(--accent)",
                flexShrink: 0,
              }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12.5, color: "var(--fg-0)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  fontWeight: 500,
                }}>
                  {lead.name || "—"}
                </div>
                <div className="mono" style={{
                  fontSize: 10.5, color: "var(--fg-2)", marginTop: 2,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {lead.city && <span>{lead.city}</span>}
                  {lead.city && <span style={{ color: "var(--fg-3)" }}>·</span>}
                  <span>{lead.created_at ? formatTimeAgo(new Date(lead.created_at)) : ""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};


// ===================================================================
// OVERVIEW SCREEN — busca dados reais do Supabase
// ===================================================================
const OverviewScreen = ({ onOpenExtract }) => {
  const [user, setUser] = React.useState(null);
  const [leads, setLeads] = React.useState([]);
  const [extractions, setExtractions] = React.useState([]);
  const [subscription, setSubscription] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const reload = async () => {
    setLoading(true);
    const l = await window.fetchLeads();
    setLeads(l || []);
    if (window.fetchExtractions) {
      const e = await window.fetchExtractions();
      setExtractions(e || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    window.supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    reload();
  }, []);

  // Calcula métricas
  const total = leads.length;
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  // Plano usado: leads dos últimos 30 dias
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthLeads = leads.filter(l => l.created_at && new Date(l.created_at) >= thirtyDaysAgo).length;

  // Plano atual (todos como Free por enquanto, até integrar Stripe)
  const currentPlan = PLAN_LIMITS.free;
  const usagePct = (monthLeads / currentPlan.limit) * 100;
  const usageColor = usagePct >= 90 ? "var(--bad)" : usagePct >= 70 ? "var(--warning, #f59e0b)" : "var(--accent)";

  // Cidades únicas
  const uniqueCities = new Set(leads.filter(l => l.city).map(l => l.city.trim().toLowerCase())).size;

  // Score médio (ignora null)
  const validScores = leads.filter(l => l.score != null && !isNaN(l.score));
  const avgScore = validScores.length > 0
    ? Math.round(validScores.reduce((a, b) => a + (b.score || 0), 0) / validScores.length)
    : null;

  const isEmpty = !loading && total === 0;

  return (
    <div style={{ padding: "24px 26px 60px" }}>
      {/* Hello row */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: 22, gap: 16,
      }}>
        <div>
          <div style={{
            fontSize: 22, fontWeight: 500,
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.015em",
            lineHeight: 1.1,
          }}>
            Olá, {userName}
          </div>
          <div style={{
            fontSize: 12.5, color: "var(--fg-2)",
            marginTop: 6,
          }}>
            {total === 0
              ? "Vamos gerar os teus primeiros leads"
              : `${total} lead${total !== 1 ? "s" : ""} no total · ${monthLeads} este mês`
            }
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <Btn variant="outline" size="md" icon="download">Exportar</Btn>
          <Btn variant="primary" size="md" icon="search" onClick={onOpenExtract}>Nova extração</Btn>
        </div>
      </div>

      {isEmpty ? (
        <EmptyStateCard onOpenExtract={onOpenExtract}/>
      ) : (
        <>
          {/* KPIs row — 4 cards minimalistas */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 16,
          }}>
            <KpiCard
              label="Leads totais"
              value={total.toLocaleString()}
              sub="no banco"
              accent
            />
            <KpiCard
              label="Score médio"
              value={avgScore != null ? avgScore : "—"}
              sub={avgScore != null ? "/ 100" : "aguardando dados"}
            />
            <KpiCard
              label={`Plano ${currentPlan.name}`}
              value={`${monthLeads}`}
              sub={`/ ${currentPlan.limit} leads · 30 dias`}
              progress={usagePct}
              progressColor={usageColor}
            />
            <KpiCard
              label="Cidades cobertas"
              value={uniqueCities}
              sub={uniqueCities === 1 ? "região" : "regiões"}
            />
          </div>

          {/* Charts row — Quality Ring + Top Cities */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}>
            <Card><QualityRing leads={leads}/></Card>
            <Card><TopCities leads={leads}/></Card>
          </div>

          {/* Mapa Global */}
          <div style={{ marginBottom: 16 }}>
            <WorldMapCard leads={leads}/>
          </div>

          {/* Bottom row — Extrações + Atividade */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            <Card><RecentExtractions extractions={extractions} onOpenExtract={onOpenExtract}/></Card>
            <Card><ActivityFeed leads={leads}/></Card>
          </div>
        </>
      )}
    </div>
  );
};


window.OverviewScreen = OverviewScreen;
