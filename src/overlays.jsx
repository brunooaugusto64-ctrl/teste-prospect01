// Lead detail drawer + Command palette

const LeadDrawer = ({ lead, onClose }) => {
  if (!lead) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "rgba(5,7,10,0.6)",
      animation: "fade-in 0.18s",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: 480,
        background: "var(--bg-2)",
        borderLeft: "1px solid var(--line-2)",
        boxShadow: "var(--shadow-2)",
        animation: "slide-in-right 0.25s ease-out",
        display: "flex", flexDirection: "column",
      }}>
        <style>{`@keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
          <ScoreCircle score={lead.score} size={48}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{lead.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-2)", marginTop: 2 }}>
              <span className="mono" style={{ color: "var(--fg-3)" }}>{lead.id}</span> · {lead.category} · {lead.city}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, display: "grid", placeItems: "center", background: "transparent", border: "1px solid var(--line-2)", borderRadius: 5, color: "var(--fg-2)" }}>
            <Icon name="x" size={13}/>
          </button>
        </div>

        {/* Status row */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Pill color={STATUS_COLORS[lead.status]}><Dot color={STATUS_COLORS[lead.status]} size={5}/> {lead.status}</Pill>
          <Pill color="var(--accent)">intenção {lead.intent}</Pill>
          {lead.tags.map(t => <Pill key={t} color="var(--fg-1)" mono={false}>{t}</Pill>)}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {/* AI explanation */}
          <div style={{
            padding: 14,
            background: "color-mix(in oklab, var(--accent) 5%, var(--bg-1))",
            border: "1px solid color-mix(in oklab, var(--accent) 35%, var(--line-2))",
            borderRadius: 6,
            marginBottom: 18,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Icon name="sparkles" size={13} style={{ color: "var(--accent)" }}/>
              <span className="uppercase-label" style={{ color: "var(--accent)" }}>análise AI</span>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.55, margin: 0 }}>
              Negócio premium em zona central de Lisboa com volume de reviews acima da média do setor. Instagram ativo (23 posts/30d), responde a clientes em &lt;24h. <span style={{ color: "var(--accent)" }}>Probabilidade de conversão: 38%</span> — recomendado contacto prioritário esta semana.
            </p>
          </div>

          {/* Contact info */}
          <div className="uppercase-label" style={{ marginBottom: 8 }}>Contacto</div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "10px 12px", fontSize: 12.5, marginBottom: 18 }}>
            <span style={{ color: "var(--fg-2)" }}>Telefone</span>
            <span className="mono" style={{ color: "var(--fg-0)" }}>{lead.phone}</span>
            <span style={{ color: "var(--fg-2)" }}>Website</span>
            <span style={{ color: "var(--info)" }}>{lead.website || "—"}</span>
            <span style={{ color: "var(--fg-2)" }}>Avaliação</span>
            <span className="mono">★ {lead.rating} · {lead.reviews} reviews</span>
            <span style={{ color: "var(--fg-2)" }}>Morada</span>
            <span>Av. da Liberdade 132, 1250-146 Lisboa</span>
            <span style={{ color: "var(--fg-2)" }}>Horário</span>
            <span>Seg-Sáb · 10:00–20:00</span>
          </div>

          {/* Score breakdown */}
          <div className="uppercase-label" style={{ marginBottom: 8 }}>Decomposição do score</div>
          <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 6, padding: 12, marginBottom: 18 }}>
            {[
              { l: "Avaliação Google", v: 22, max: 22 },
              { l: "Volume de reviews", v: 14, max: 14 },
              { l: "Presença web", v: 12, max: 12 },
              { l: "Atividade Instagram", v: 16, max: 18 },
              { l: "Sentimento de reviews", v: 15, max: 16 },
              { l: "Responsividade", v: 8, max: 10 },
              { l: "Penalty: sem booking online", v: -7, max: 0 },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
                <span style={{ fontSize: 11.5, color: "var(--fg-1)", width: 170 }}>{r.l}</span>
                <div style={{ flex: 1, height: 5, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.abs(r.v) / 25 * 100}%`, height: "100%",
                    background: r.v < 0 ? "var(--bad)" : "var(--accent)", borderRadius: 2,
                  }}/>
                </div>
                <span className="mono tabular" style={{ fontSize: 11, color: r.v < 0 ? "var(--bad)" : "var(--good)", width: 30, textAlign: "right" }}>
                  {r.v > 0 ? `+${r.v}` : r.v}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="uppercase-label" style={{ marginBottom: 8 }}>Timeline</div>
          <div style={{ position: "relative", paddingLeft: 16 }}>
            <div style={{ position: "absolute", left: 5, top: 6, bottom: 6, width: 1, background: "var(--line-2)" }}/>
            {[
              { t: "há 2 min", a: "Auto-promovido", d: "Score subiu de 88 → 94 · novo review 5★", c: "var(--accent)" },
              { t: "há 18 min", a: "Notion sync", d: "Item criado em Pipeline 2026", c: "var(--info)" },
              { t: "ontem", a: "Re-scoring", d: "Análise semanal · sentimento +3", c: "var(--fg-2)" },
              { t: "há 3 dias", a: "Extraído", d: "Prompt: \"10 clínicas estética em Lisboa\"", c: "var(--fg-2)" },
            ].map((ev, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: 14 }}>
                <div style={{ position: "absolute", left: -16, top: 4, width: 11, height: 11, borderRadius: "50%", background: "var(--bg-2)", border: `2px solid ${ev.c}` }}/>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{ev.a}</span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>{ev.t}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--fg-2)" }}>{ev.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
          <Btn variant="primary" size="md" icon="phone" style={{ flex: 1, justifyContent: "center" }}>Ligar</Btn>
          <Btn variant="secondary" size="md" icon="notion" style={{ flex: 1, justifyContent: "center" }}>Abrir no Notion</Btn>
          <Btn variant="outline" size="md" icon="more"/>
        </div>
      </div>
    </div>
  );
};

const CommandPalette = ({ open, onClose, onNav, onExtract }) => {
  const [query, setQuery] = React.useState("");
  const items = [
    { icon: "search", label: "Nova extração de leads", kbd: "⌘N", action: () => { onClose(); onExtract(); }, group: "Ações" },
    { icon: "users", label: "Ir para Leads", action: () => { onClose(); onNav("leads"); }, group: "Navegação" },
    { icon: "funnel", label: "Ir para Funil", action: () => { onClose(); onNav("funnel"); }, group: "Navegação" },
    { icon: "sparkles", label: "Ir para AI Scoring", action: () => { onClose(); onNav("scoring"); }, group: "Navegação" },
    { icon: "plug", label: "Ir para Integrações", action: () => { onClose(); onNav("integrations"); }, group: "Navegação" },
    { icon: "card", label: "Ir para Faturação", action: () => { onClose(); onNav("billing"); }, group: "Navegação" },
    { icon: "notion", label: "Sincronizar com Notion agora", action: onClose, group: "Ações" },
    { icon: "download", label: "Exportar leads como CSV", action: onClose, group: "Ações" },
  ];
  const filtered = query ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : items;

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 110,
      background: "rgba(5,7,10,0.7)",
      backdropFilter: "blur(3px)",
      display: "grid", placeItems: "start center",
      paddingTop: "12vh",
      animation: "fade-in 0.15s",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 540,
        background: "var(--bg-2)",
        border: "1px solid var(--line-2)",
        borderRadius: 8,
        boxShadow: "var(--shadow-2)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="command" size={14} style={{ color: "var(--fg-2)" }}/>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar comando..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13.5, color: "var(--fg-0)" }}
          />
          <Kbd>esc</Kbd>
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto", padding: 6 }}>
          {filtered.map((it, i) => (
            <button key={i} onClick={it.action} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", background: i === 0 ? "var(--bg-3)" : "transparent",
              border: "none", borderRadius: 5, color: "var(--fg-1)", textAlign: "left", fontSize: 12.5,
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = i === 0 ? "var(--bg-3)" : "transparent"}>
              <Icon name={it.icon} size={14} style={{ color: "var(--fg-2)" }}/>
              <span style={{ flex: 1 }}>{it.label}</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>{it.group}</span>
              {it.kbd && <Kbd>{it.kbd}</Kbd>}
            </button>
          ))}
          {filtered.length === 0 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: "var(--fg-2)" }}>Sem resultados</div>}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { LeadDrawer, CommandPalette });
