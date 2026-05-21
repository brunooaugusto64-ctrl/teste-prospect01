// Lead Management table — telefone abre WhatsApp + exportação CSV + status de extração

const STATUS_COLORS = {
  novo: "var(--fg-2)",
  contactado: "var(--accent-cyan)",
  qualificado: "var(--accent)",
  convertido: "var(--good)",
};

const STATUS_LABELS = {
  novo: "Novo",
  contactado: "Contactado",
  qualificado: "Qualificado",
  convertido: "Convertido",
};

const colorFromName = (name) => {
  if (!name) return "oklch(0.6 0.18 280)";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = 200 + (Math.abs(hash) % 100);
  return `oklch(0.62 0.18 ${hue})`;
};

const getInitials = (name) => {
  if (!name) return "—";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const cleanUrl = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
};

const phoneToWhatsApp = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

const buildWhatsAppUrl = (phone) => {
  const clean = phoneToWhatsApp(phone);
  if (!clean) return "";
  return `https://wa.me/${clean}`;
};

const formatScore = (score) => {
  if (score == null) return null;
  return score > 10 ? (score / 10).toFixed(1) : score.toFixed(1);
};

const ScoreBadge = ({ score }) => {
  if (score == null) return <span style={{ color: "var(--fg-3)", fontSize: 11 }}>—</span>;
  const n = score > 10 ? score / 10 : score;
  const formatted = formatScore(score);

  let label, emoji, color;
  if (n >= 8) { label = "Quente"; emoji = "🔥"; color = "var(--accent)"; }
  else if (n >= 6) { label = "Morno"; emoji = "🌡️"; color = "var(--accent-cyan)"; }
  else { label = "Frio"; emoji = "❄️"; color = "var(--fg-2)"; }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span className="mono tabular" style={{
        fontSize: 13, fontWeight: 600, color,
        minWidth: 28, textAlign: "right",
      }}>{formatted}</span>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 8px",
        background: `color-mix(in oklab, ${color} 14%, transparent)`,
        border: `1px solid color-mix(in oklab, ${color} 35%, transparent)`,
        borderRadius: 4,
        fontSize: 10, color,
        fontWeight: 500,
        letterSpacing: "0.02em",
      }}>
        <span style={{ fontSize: 9 }}>{emoji}</span>
        {label}
      </span>
    </div>
  );
};

const TableHeader = ({ children, w, onClick, active }) => (
  <th onClick={onClick} style={{
    textAlign: "left",
    padding: "11px 14px",
    fontFamily: "var(--font-mono)",
    fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
    color: active ? "var(--accent)" : "var(--fg-2)",
    fontWeight: 500,
    borderBottom: "1px solid var(--line-2)",
    background: "var(--bg-1)",
    position: "sticky", top: 0, zIndex: 1,
    width: w,
    userSelect: "none",
    cursor: onClick ? "pointer" : "default",
    transition: "color 0.15s",
  }}
  onMouseEnter={(e) => { if (onClick && !active) e.currentTarget.style.color = "var(--fg-0)"; }}
  onMouseLeave={(e) => { if (onClick && !active) e.currentTarget.style.color = "var(--fg-2)"; }}>
    {children}
  </th>
);

const FilterChip = ({ label, value, active, onClick, onClear }) => (
  <button onClick={onClick} style={{
    height: 28, padding: "0 11px",
    display: "inline-flex", alignItems: "center", gap: 6,
    background: active ? "color-mix(in oklab, var(--accent) 12%, var(--bg-3))" : "var(--bg-2)",
    border: "1px solid " + (active ? "var(--accent)" : "var(--line-2)"),
    borderRadius: 6,
    fontSize: 11.5, color: active ? "var(--fg-0)" : "var(--fg-1)",
    cursor: "pointer",
    transition: "all 0.15s",
  }}
  onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--line-3)"; }}
  onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--line-2)"; }}>
    <span className="uppercase-label" style={{ fontSize: 9, color: active ? "var(--accent)" : "var(--fg-2)" }}>{label}</span>
    <span style={{ fontSize: 11.5 }}>{value}</span>
    {active && onClear && (
      <span onClick={(e) => { e.stopPropagation(); onClear(); }}
        style={{ marginLeft: 2, color: "var(--fg-2)", display: "inline-flex" }}>
        <Icon name="x" size={10}/>
      </span>
    )}
  </button>
);

// =====================================================
// MENSAGEM DE EXTRAÇÃO EM CURSO
// =====================================================
const ExtractionStatus = () => {
  const [status, setStatus] = React.useState(null);
  const [secondsLeft, setSecondsLeft] = React.useState(0);

  React.useEffect(() => {
    const check = () => {
      try {
        const startedAt = parseInt(localStorage.getItem("extracting_at"), 10);
        const count = parseInt(localStorage.getItem("extracting_count"), 10) || 10;

        if (!startedAt) {
          setStatus(null);
          return;
        }

        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        const remaining = Math.max(0, 90 - elapsed);

        if (remaining === 0) {
          localStorage.removeItem("extracting_at");
          localStorage.removeItem("extracting_count");
          setStatus(null);
          setSecondsLeft(0);
        } else {
          setStatus({ startedAt, count });
          setSecondsLeft(remaining);
        }
      } catch (e) {
        setStatus(null);
      }
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <div style={{
      padding: "10px 24px",
      borderBottom: "1px solid var(--line)",
      background: "var(--bg-1)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 12,
      color: "var(--fg-1)",
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: "50%",
        border: "1.5px solid var(--line-2)", borderTopColor: "var(--accent)",
        animation: "spin 0.8s linear infinite",
        flexShrink: 0,
      }}/>

      <span style={{ flex: 1 }}>
        A processar a tua extração de <strong style={{ color: "var(--accent)" }}>{status.count} leads</strong>... os leads chegam em <strong style={{ color: "var(--fg-0)" }}>~{secondsLeft}s</strong>
      </span>

      <button
        onClick={() => {
          localStorage.removeItem("extracting_at");
          localStorage.removeItem("extracting_count");
          window.location.reload();
        }}
        style={{
          width: 22, height: 22, display: "grid", placeItems: "center",
          background: "transparent", border: "1px solid var(--line-2)", borderRadius: 4,
          color: "var(--fg-2)", cursor: "pointer",
        }}
        title="Dispensar"
      >
        <Icon name="x" size={10}/>
      </button>
    </div>
  );
};

// =====================================================
// EXPORTAR CSV
// =====================================================
const exportToCSV = (leads) => {
  if (!leads || leads.length === 0) {
    alert("Nenhum lead pra exportar.");
    return;
  }

  const headers = [
    "Nome",
    "Categoria",
    "Cidade",
    "Telefone",
    "Website",
    "Score",
    "Status",
    "Adicionado em",
  ];

  const escapeCSV = (value) => {
    if (value == null) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = leads.map(lead => [
    escapeCSV(lead.name),
    escapeCSV(lead.category),
    escapeCSV(lead.city),
    escapeCSV(lead.phone),
    escapeCSV(lead.website),
    escapeCSV(lead.score != null ? (lead.score > 10 ? (lead.score / 10).toFixed(1) : lead.score.toFixed(1)) : ""),
    escapeCSV(STATUS_LABELS[lead.status] || "Novo"),
    escapeCSV(lead.created_at ? new Date(lead.created_at).toLocaleDateString("pt-BR") : ""),
  ].join(","));

  const BOM = "\uFEFF";
  const csv = BOM + headers.join(",") + "\n" + rows.join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const today = new Date().toISOString().split("T")[0];
  link.download = `prospect-ia-leads-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// =====================================================
// EMPTY STATE
// =====================================================
const LeadsEmptyState = ({ onOpenExtract }) => (
  <div style={{
    padding: "80px 24px",
    textAlign: "center",
    animation: "fade-in 0.4s ease-out",
  }}>
    <style>{`
      @keyframes float-icon {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--accent) 30%, transparent); }
        50% { box-shadow: 0 0 0 14px color-mix(in oklab, var(--accent) 0%, transparent); }
      }
    `}</style>
    <div style={{
      width: 64, height: 64,
      margin: "0 auto 18px",
      borderRadius: 14,
      background: "var(--gradient-soft)",
      border: "1px solid color-mix(in oklab, var(--accent) 35%, var(--line-2))",
      display: "grid", placeItems: "center",
      color: "var(--accent)",
      animation: "float-icon 2.6s ease-in-out infinite, pulse-glow 2.6s ease-in-out infinite",
    }}>
      <Icon name="users" size={28}/>
    </div>
    <div style={{
      fontSize: 18,
      fontWeight: 500,
      fontFamily: "var(--font-display)",
      letterSpacing: "-0.01em",
      marginBottom: 8,
    }}>Ainda não tens leads</div>
    <div style={{
      fontSize: 13,
      color: "var(--fg-2)",
      maxWidth: 420,
      margin: "0 auto 22px",
      lineHeight: 1.6,
    }}>
      Cria a tua primeira extração para começar a capturar leads.<br/>
      Os resultados aparecem aqui automaticamente em ~60 segundos.
    </div>
    <Btn variant="primary" size="lg" icon="search" onClick={onOpenExtract}>
      Criar primeira extração
    </Btn>
    <div style={{
      marginTop: 24,
      fontSize: 10.5,
      color: "var(--fg-3)",
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.06em",
    }}>
      ⌘N · ATALHO RÁPIDO
    </div>
  </div>
);


const LeadsScreen = ({ onOpenLead, onOpenExtract }) => {
  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("todos");
  const [filterScore, setFilterScore] = React.useState("todos");
  const [selected, setSelected] = React.useState(new Set());
  const [sortBy, setSortBy] = React.useState("created");
  const [hoveredRow, setHoveredRow] = React.useState(null);

  const reload = async () => {
    setLoading(true);
    const data = await window.fetchLeads();
    setLeads(data);
    setLoading(false);
  };

  React.useEffect(() => {
    reload();
  }, []);

  let rows = [...leads];
  if (search) {
    const s = search.toLowerCase();
    rows = rows.filter(r =>
      r.name?.toLowerCase().includes(s) ||
      r.city?.toLowerCase().includes(s) ||
      r.category?.toLowerCase().includes(s)
    );
  }
  if (filterStatus !== "todos") rows = rows.filter(r => r.status === filterStatus);
  if (filterScore === "com") rows = rows.filter(r => r.score != null);
  if (filterScore === "sem") rows = rows.filter(r => r.score == null);

  if (sortBy === "score") rows.sort((a, b) => (b.score || 0) - (a.score || 0));
  else if (sortBy === "name") rows.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  else rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const toggleRow = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };
  const allSelected = rows.length > 0 && rows.every(r => selected.has(r.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(rows.map(r => r.id)));
  };

  const handleExport = () => {
    if (selected.size > 0) {
      const selectedLeads = leads.filter(l => selected.has(l.id));
      exportToCSV(selectedLeads);
    } else {
      exportToCSV(rows);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: 80, textAlign: "center",
        color: "var(--fg-2)", fontFamily: "var(--font-mono)", fontSize: 12,
        letterSpacing: "0.06em",
      }}>
        <div style={{
          width: 28, height: 28,
          margin: "0 auto 14px",
          borderRadius: "50%",
          border: "2px solid var(--line-2)",
          borderTopColor: "var(--accent)",
          animation: "spin 0.8s linear infinite",
        }}/>
        a carregar leads...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ExtractionStatus />
        <LeadsEmptyState onOpenExtract={onOpenExtract}/>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 78px)" }}>
      <ExtractionStatus />
      <style>{`
        @keyframes row-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lead-row {
          animation: row-fade-in 0.3s ease-out backwards;
        }
        .lead-row:hover .lead-avatar {
          transform: scale(1.06);
          box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent) 30%, transparent);
        }
        .lead-row:hover .lead-name {
          color: var(--accent);
        }
        .wa-link:hover {
          background: color-mix(in oklab, #25D366 18%, transparent) !important;
          color: #25D366 !important;
        }
      `}</style>

      <div style={{
        padding: "16px 24px 14px",
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-1)",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0 12px", height: 36, flex: 1, maxWidth: 460,
            background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 7,
            transition: "border-color 0.15s",
          }}>
            <Icon name="search" size={14} style={{ color: "var(--fg-2)" }}/>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar nome, cidade ou categoria..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 13, color: "var(--fg-0)",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{
                background: "transparent", border: "none", color: "var(--fg-3)",
                padding: 2, cursor: "pointer", display: "grid", placeItems: "center",
              }}>
                <Icon name="x" size={11}/>
              </button>
            )}
          </div>
          <div style={{ flex: 1 }}/>
          <Btn variant="outline" size="md" icon="download" onClick={handleExport}>
            Exportar CSV
          </Btn>
          <Btn variant="outline" size="md" icon="refresh" onClick={reload}>Atualizar</Btn>
          <Btn variant="primary" size="md" icon="plus" onClick={onOpenExtract}>Nova extração</Btn>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className="uppercase-label" style={{ marginRight: 4 }}>Filtros</span>
          <FilterChip
            label="Status"
            value={filterStatus}
            active={filterStatus !== "todos"}
            onClick={() => {
              const order = ["todos", "novo", "contactado", "qualificado", "convertido"];
              const i = order.indexOf(filterStatus);
              setFilterStatus(order[(i + 1) % order.length]);
            }}
            onClear={() => setFilterStatus("todos")}
          />
          <FilterChip
            label="Score"
            value={filterScore === "todos" ? "todos" : filterScore === "com" ? "com score" : "sem score"}
            active={filterScore !== "todos"}
            onClick={() => {
              const order = ["todos", "com", "sem"];
              const i = order.indexOf(filterScore);
              setFilterScore(order[(i + 1) % order.length]);
            }}
            onClear={() => setFilterScore("todos")}
          />
          <FilterChip
            label="Ordem"
            value={sortBy === "created" ? "mais recentes" : sortBy === "score" ? "melhor score" : "nome A-Z"}
            active={sortBy !== "created"}
            onClick={() => {
              const order = ["created", "score", "name"];
              const i = order.indexOf(sortBy);
              setSortBy(order[(i + 1) % order.length]);
            }}
            onClear={() => setSortBy("created")}
          />
          <div style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-2)" }}>
            <span style={{ color: "var(--fg-0)", fontWeight: 500 }}>{rows.length}</span> de {leads.length} leads
          </span>
        </div>
      </div>

      {selected.size > 0 && (
        <div style={{
          padding: "10px 24px",
          background: "color-mix(in oklab, var(--accent) 10%, var(--bg-2))",
          borderBottom: "1px solid var(--accent)",
          display: "flex", alignItems: "center", gap: 12,
          animation: "row-fade-in 0.2s ease-out",
        }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>
            {selected.size} selecionado{selected.size > 1 ? "s" : ""}
          </span>
          <span style={{ width: 1, height: 14, background: "var(--line-3)" }}/>
          <Btn size="sm" variant="ghost" icon="download" onClick={handleExport}>
            Exportar selecionados
          </Btn>
          <Btn size="sm" variant="ghost" icon="trash" onClick={async () => {
            if (!confirm(`Apagar ${selected.size} lead(s)? Esta ação não pode ser desfeita.`)) return;
            const ids = Array.from(selected);
            const { error } = await window.supabase.from("leads").delete().in("id", ids);
            if (error) {
              alert("Erro: " + error.message);
            } else {
              setSelected(new Set());
              reload();
            }
          }}>Eliminar</Btn>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setSelected(new Set())} style={{
            background: "transparent", border: "none", color: "var(--fg-2)", fontSize: 11.5,
            padding: "4px 8px", cursor: "pointer",
          }}>Cancelar</button>
        </div>
      )}

      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr>
              <TableHeader w={38}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll}
                  style={{ accentColor: "var(--accent)", cursor: "pointer" }}/>
              </TableHeader>
              <TableHeader onClick={() => setSortBy("name")} active={sortBy === "name"}>Empresa</TableHeader>
              <TableHeader>Categoria</TableHeader>
              <TableHeader>Cidade</TableHeader>
              <TableHeader>Telefone</TableHeader>
              <TableHeader>Website</TableHeader>
              <TableHeader onClick={() => setSortBy("score")} active={sortBy === "score"}>Score</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader w={120}>Adicionado</TableHeader>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const sel = selected.has(r.id);
              const created = r.created_at ? new Date(r.created_at) : null;
              const createdAgo = created ? formatTimeAgo(created) : "—";
              const avatarColor = colorFromName(r.name);
              const initials = getInitials(r.name);
              const isHovered = hoveredRow === r.id;
              const waUrl = buildWhatsAppUrl(r.phone);

              return (
                <tr key={r.id}
                  className="lead-row"
                  onClick={() => onOpenLead(r)}
                  onMouseEnter={() => setHoveredRow(r.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: sel
                      ? "color-mix(in oklab, var(--accent) 10%, transparent)"
                      : isHovered
                        ? "var(--bg-2)"
                        : "transparent",
                    borderBottom: "1px solid var(--line)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    animationDelay: `${Math.min(i * 0.02, 0.3)}s`,
                  }}>
                  <td style={{ padding: "12px 14px" }} onClick={(e) => { e.stopPropagation(); toggleRow(r.id); }}>
                    <input type="checkbox" checked={sel} readOnly style={{ accentColor: "var(--accent)", cursor: "pointer" }}/>
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="lead-avatar" style={{
                        width: 30, height: 30, borderRadius: 7,
                        background: `linear-gradient(135deg, ${avatarColor}, color-mix(in oklab, ${avatarColor} 70%, black))`,
                        display: "grid", placeItems: "center",
                        fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, color: "#fff",
                        flexShrink: 0,
                        transition: "all 0.2s",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                      }}>
                        {initials}
                      </div>
                      <div className="lead-name" style={{
                        fontWeight: 500,
                        color: "var(--fg-0)",
                        fontSize: 13,
                        transition: "color 0.15s",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        maxWidth: 220,
                      }}>{r.name || "—"}</div>
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    {r.category ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center",
                        padding: "3px 9px",
                        background: "var(--bg-3)",
                        border: "1px solid var(--line-2)",
                        borderRadius: 4,
                        fontSize: 11, color: "var(--fg-1)",
                      }}>{r.category}</span>
                    ) : (
                      <span style={{ color: "var(--fg-3)", fontSize: 11 }}>—</span>
                    )}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    {r.city ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        color: "var(--fg-1)", fontSize: 12,
                      }}>
                        <Icon name="map-pin" size={11} style={{ color: "var(--fg-3)" }}/>
                        {r.city}
                      </span>
                    ) : (
                      <span style={{ color: "var(--fg-3)", fontSize: 11 }}>—</span>
                    )}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    {r.phone ? (
                      
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="wa-link mono tabular"
                        title="Abrir WhatsApp"
                        style={{
                          fontSize: 12, color: "var(--fg-0)",
                          textDecoration: "none",
                          padding: "4px 10px 4px 8px",
                          borderRadius: 5,
                          transition: "all 0.15s",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          border: "1px solid var(--line-2)",
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {r.phone}
                      </a>
                    ) : (
                      <span style={{ color: "var(--fg-3)", fontSize: 11 }}>—</span>
                    )}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    {r.website ? (
                      
                        href={r.website.startsWith("http") ? r.website : "https://" + r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: 11.5, color: "var(--accent-cyan)",
                          textDecoration: "none",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          maxWidth: 200, display: "inline-flex", alignItems: "center", gap: 5,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                      >
                        <Icon name="external" size={10}/>
                        {cleanUrl(r.website)}
                      </a>
                    ) : (
                      <span style={{ color: "var(--fg-3)", fontSize: 11 }}>—</span>
                    )}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <ScoreBadge score={r.score}/>
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "3px 9px",
                      background: `color-mix(in oklab, ${STATUS_COLORS[r.status] || "var(--fg-2)"} 12%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${STATUS_COLORS[r.status] || "var(--fg-2)"} 35%, transparent)`,
                      borderRadius: 4,
                      fontSize: 10.5,
                      color: STATUS_COLORS[r.status] || "var(--fg-1)",
                      fontWeight: 500,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}>
                      <Dot color={STATUS_COLORS[r.status] || "var(--fg-2)"} size={5}/>
                      {STATUS_LABELS[r.status] || "Novo"}
                    </span>
                  </td>

                  <td style={{
                    padding: "12px 14px",
                    color: "var(--fg-2)", fontSize: 11.5,
                    fontFamily: "var(--font-mono)",
                  }}>{createdAgo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div style={{ padding: 80, textAlign: "center", color: "var(--fg-2)" }}>
            <Icon name="search" size={28} style={{ color: "var(--fg-3)", marginBottom: 12 }}/>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Nenhum lead corresponde aos filtros</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-3)" }}>Tenta limpar a pesquisa ou os filtros</div>
          </div>
        )}
      </div>

      <div style={{
        padding: "10px 24px",
        borderTop: "1px solid var(--line)",
        background: "var(--bg-1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: 11, color: "var(--fg-2)",
      }}>
        <span className="mono">
          <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>{leads.length}</span> leads totais
        </span>
        <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Dot color="var(--good)" size={5} pulse/>
          Sincronizado
        </span>
      </div>
    </div>
  );
};

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffH < 24) return `há ${diffH} h`;
  if (diffD === 1) return "ontem";
  if (diffD < 30) return `há ${diffD} dias`;
  return date.toLocaleDateString("pt-BR");
}

window.LeadsScreen = LeadsScreen;
window.formatTimeAgo = formatTimeAgo;
