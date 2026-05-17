// Templates Storefront — venda de templates próprios via Stripe Payment Links
// Os produtos são gerenciados em src/templates-data.js (window.TEMPLATES)
// Mantém o mesmo visual elegante do marketplace original.

// Thumb com imagem real OU fallback procedural
const TemplateThumb = ({ template, hovered }) => {
  const [bg, ...colors] = template.palette || ["#0a0b0d", "#f4f5f7", "#f5b942"];

  // Se tem foto real, usa
  if (template.fotoCapa && template.fotoCapa.trim()) {
    return (
      <div style={{
        position: "relative",
        aspectRatio: "16 / 10",
        background: bg,
        overflow: "hidden",
        borderRadius: "7px 7px 0 0",
        transition: "transform 0.4s ease",
        transform: hovered ? "scale(1.03)" : "scale(1)",
      }}>
        <img
          src={template.fotoCapa}
          alt={template.nome}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {/* Hover overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
          display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14,
        }}>
          <div style={{
            padding: "5px 12px",
            background: "var(--accent)", color: "var(--accent-fg)",
            borderRadius: 4,
            fontSize: 11, fontWeight: 600,
            fontFamily: "var(--font-mono)", letterSpacing: "0.04em", textTransform: "uppercase",
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "transform 0.2s",
          }}>Pré-visualizar →</div>
        </div>
      </div>
    );
  }

  // Fallback procedural (mesmo visual do original quando não tem foto)
  return (
    <div style={{
      position: "relative",
      aspectRatio: "16 / 10",
      background: bg,
      overflow: "hidden",
      borderRadius: "7px 7px 0 0",
      transition: "transform 0.4s ease",
      transform: hovered ? "scale(1.03)" : "scale(1)",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 14,
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", paddingLeft: 6, gap: 3,
      }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}/>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}/>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}/>
      </div>
      <div style={{ position: "absolute", inset: "22px 18px 18px" }}>
        <div style={{ width: "60%", height: 8, background: colors[0] || "rgba(255,255,255,0.7)", borderRadius: 2, marginBottom: 5 }}/>
        <div style={{ width: "85%", height: 8, background: colors[0] || "rgba(255,255,255,0.7)", borderRadius: 2, marginBottom: 5 }}/>
        <div style={{ width: "40%", height: 8, background: colors[0] || "rgba(255,255,255,0.5)", borderRadius: 2, marginBottom: 12, opacity: 0.6 }}/>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          <div style={{ width: 36, height: 12, background: colors[1] || colors[0] || "var(--accent)", borderRadius: 2 }}/>
          <div style={{ width: 24, height: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2 }}/>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              flex: 1, height: 26,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 2,
              padding: 3,
              display: "flex", flexDirection: "column", gap: 2,
            }}>
              <div style={{ width: "60%", height: 3, background: colors[i % colors.length] || "rgba(255,255,255,0.4)", borderRadius: 1 }}/>
              <div style={{ width: "90%", height: 2, background: "rgba(255,255,255,0.2)", borderRadius: 1 }}/>
              <div style={{ width: "70%", height: 2, background: "rgba(255,255,255,0.2)", borderRadius: 1 }}/>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.2s",
        display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14,
      }}>
        <div style={{
          padding: "5px 12px",
          background: "var(--accent)", color: "var(--accent-fg)",
          borderRadius: 4,
          fontSize: 11, fontWeight: 600,
          fontFamily: "var(--font-mono)", letterSpacing: "0.04em", textTransform: "uppercase",
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "transform 0.2s",
        }}>Pré-visualizar →</div>
      </div>
    </div>
  );
};

const TemplateCard = ({ template, onOpen }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(template)}
      style={{
        background: "var(--bg-2)",
        border: "1px solid " + (hover ? "var(--line-3)" : "var(--line)"),
        borderRadius: 8,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.18s",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? "0 16px 32px rgba(0,0,0,0.4)" : "none",
        display: "flex", flexDirection: "column",
      }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <TemplateThumb template={template} hovered={hover}/>
        {template.badge && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            padding: "3px 7px",
            background: template.badge === "Novo" ? "var(--good)" : "var(--accent)",
            color: "var(--accent-fg)",
            fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            borderRadius: 3,
          }}>{template.badge}</div>
        )}
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{template.categoria}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg-0)", letterSpacing: "-0.005em" }}>{template.nome}</div>
        </div>
        <div style={{ fontSize: 11.5, color: "var(--fg-2)", lineHeight: 1.45 }}>{template.descricao}</div>
      </div>
      <div style={{
        padding: "10px 14px",
        borderTop: "1px solid var(--line)",
        background: "var(--bg-1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "var(--font-display)" }} className="tabular">
            €{template.preco}
          </span>
          {template.precoOriginal && (
            <span className="mono tabular" style={{ fontSize: 11, color: "var(--fg-3)", textDecoration: "line-through" }}>
              €{template.precoOriginal}
            </span>
          )}
        </div>
        {template.precoOriginal && (
          <Pill color="var(--good)">−{Math.round((1 - template.preco/template.precoOriginal) * 100)}%</Pill>
        )}
      </div>
    </div>
  );
};

const FeaturedHero = ({ template, onOpen }) => {
  if (!template) return null;
  return (
    <div onClick={() => onOpen(template)} style={{
      position: "relative",
      borderRadius: 10,
      overflow: "hidden",
      cursor: "pointer",
      border: "1px solid var(--line-2)",
      background: "linear-gradient(135deg, oklch(0.18 0.04 60), oklch(0.12 0.02 250))",
      padding: 24,
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
      minHeight: 220,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(245,185,66,0.08) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        pointerEvents: "none",
      }}/>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="sparkles" size={11}/> EM DESTAQUE
        </div>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {template.nome}
        </h2>
        <p style={{ fontSize: 13, color: "var(--fg-1)", marginTop: 10, marginBottom: 18, maxWidth: 360, lineHeight: 1.55 }}>
          {template.descricao}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 600, fontFamily: "var(--font-display)" }} className="tabular">
              €{template.preco}
            </span>
            {template.precoOriginal && (
              <Pill color="var(--good)">−{Math.round((1 - template.preco/template.precoOriginal) * 100)}%</Pill>
            )}
          </div>
          <Btn variant="primary" size="lg" iconRight="arrow-right">Ver template</Btn>
        </div>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: "100%", maxWidth: 360,
          transform: "perspective(800px) rotateY(-8deg) rotateX(4deg)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px var(--line-2)",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <TemplateThumb template={template} hovered={false}/>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MODAL DE DETALHES — clica num template, abre painel lateral
// ============================================================
const TemplateDetail = ({ template, onClose }) => {
  const [tab, setTab] = React.useState("descricao");
  const [activePhoto, setActivePhoto] = React.useState(0);

  if (!template) return null;

  // Coleta fotos disponíveis (capa + extras não vazios)
  const photos = [template.fotoCapa, ...(template.fotosExtras || [])].filter(p => p && p.trim());

  const handleBuy = () => {
    if (template.stripeLink && template.stripeLink.trim()) {
      window.open(template.stripeLink, "_blank", "noopener,noreferrer");
    } else {
      alert("Stripe Payment Link ainda não configurado. Vai em src/templates-data.js e preenche o campo 'stripeLink'.");
    }
  };

  const handlePreview = () => {
    if (template.previewLink && template.previewLink.trim()) {
      window.open(template.previewLink, "_blank", "noopener,noreferrer");
    } else {
      alert("Demo ainda não configurada. Vai em src/templates-data.js e preenche o campo 'previewLink'.");
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href + "#" + template.id;
    navigator.clipboard?.writeText(url);
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(5,7,10,0.78)",
      backdropFilter: "blur(4px)",
      animation: "fade-in 0.2s",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "min(960px, 92vw)",
        background: "var(--bg-1)",
        borderLeft: "1px solid var(--line-2)",
        boxShadow: "var(--shadow-2)",
        display: "flex", flexDirection: "column",
        animation: "slide-in-right 0.25s ease-out",
      }}>
        <style>{`@keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onClose} style={{ width: 28, height: 28, display: "grid", placeItems: "center", background: "transparent", border: "1px solid var(--line-2)", borderRadius: 5, color: "var(--fg-2)", cursor: "pointer" }}>
            <Icon name="x" size={13}/>
          </button>
          <span className="mono" style={{ fontSize: 10.5, color: "var(--fg-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Templates / {template.categoria} / <span style={{ color: "var(--fg-1)" }}>{template.nome}</span>
          </span>
          <div style={{ flex: 1 }}/>
          {template.previewLink && (
            <Btn size="sm" variant="ghost" icon="external" onClick={handlePreview}>Demo live</Btn>
          )}
          <Btn size="sm" variant="ghost" icon="copy" onClick={handleCopyLink}>Copiar link</Btn>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 0 }}>
            {/* Esquerda — preview */}
            <div style={{ padding: "24px 22px", borderRight: "1px solid var(--line)" }}>
              {/* Preview principal */}
              <div style={{
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid var(--line-2)",
                marginBottom: 12,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}>
                {photos.length > 0 ? (
                  <div style={{
                    position: "relative",
                    aspectRatio: "16 / 10",
                    background: template.palette?.[0] || "#0a0b0d",
                  }}>
                    <img
                      src={photos[activePhoto]}
                      alt={template.nome}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ) : (
                  <TemplateThumb template={template} hovered={false}/>
                )}
              </div>

              {/* Thumbnail strip */}
              {photos.length > 1 && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(photos.length, 4)}, 1fr)`, gap: 6, marginBottom: 24 }}>
                  {photos.slice(0, 4).map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      style={{
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid " + (i === activePhoto ? "var(--accent)" : "var(--line-2)"),
                        cursor: "pointer",
                        opacity: i === activePhoto ? 1 : 0.6,
                        aspectRatio: "16 / 10",
                        background: template.palette?.[0] || "#0a0b0d",
                        transition: "all 0.15s",
                      }}>
                      <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    </div>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--line)", marginBottom: 18 }}>
                {[
                  { id: "descricao", label: "Descrição" },
                  { id: "info", label: "Informações" },
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    padding: "10px 14px",
                    background: "transparent", border: "none",
                    borderBottom: "2px solid " + (tab === t.id ? "var(--accent)" : "transparent"),
                    color: tab === t.id ? "var(--fg-0)" : "var(--fg-2)",
                    fontSize: 12.5, fontWeight: tab === t.id ? 500 : 400, marginBottom: -1,
                    cursor: "pointer",
                  }}>{t.label}</button>
                ))}
              </div>

              {tab === "descricao" && (
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Sobre este template</h3>
                  <p style={{ fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.6, marginTop: 10 }}>
                    {template.descricaoLonga || template.descricao}
                  </p>
                </div>
              )}

              {tab === "info" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  {[
                    { l: "Última atualização", v: template.ultimaAtualizacao || "—" },
                    { l: "Tamanho", v: template.tamanho || "—" },
                    { l: "Formato", v: template.formato || "—" },
                    { l: "Licença", v: template.licenca || "Comercial" },
                  ].map(s => (
                    <div key={s.l} style={{ padding: 12, background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 5 }}>
                      <div className="uppercase-label" style={{ fontSize: 9.5 }}>{s.l}</div>
                      <div className="mono" style={{ fontSize: 11.5, color: "var(--fg-1)", marginTop: 4 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direita — buy box */}
            <div style={{ padding: "24px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                  {template.categoria}
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.015em", lineHeight: 1.15 }}>
                  {template.nome}
                </h2>
              </div>

              <div style={{
                padding: 18,
                background: "var(--bg-2)",
                border: "1px solid var(--line-2)",
                borderRadius: 8,
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: "var(--fg-2)" }}>€</span>
                  <span style={{ fontSize: 38, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1 }} className="tabular">{template.preco}</span>
                  {template.precoOriginal && (
                    <>
                      <span className="mono tabular" style={{ fontSize: 13, color: "var(--fg-3)", textDecoration: "line-through" }}>
                        €{template.precoOriginal}
                      </span>
                      <Pill color="var(--good)" style={{ marginLeft: 4 }}>−{Math.round((1 - template.preco/template.precoOriginal) * 100)}%</Pill>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-2)", marginBottom: 14 }}>
                  Pagamento único · acesso vitalício · IVA incluído
                </div>
                <Btn
                  variant="primary"
                  size="lg"
                  icon="card"
                  onClick={handleBuy}
                  style={{ width: "100%", justifyContent: "center", fontSize: 13.5 }}>
                  Comprar por €{template.preco}
                </Btn>
                <Btn
                  variant="outline"
                  size="md"
                  icon="external"
                  onClick={handlePreview}
                  style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                  Pré-visualizar online
                </Btn>
                <div style={{
                  marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)",
                  fontSize: 10.5, color: "var(--fg-2)",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Icon name="shield" size={11} style={{ color: "var(--good)" }}/>
                  Pagamento seguro via Stripe · garantia 30 dias
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {[
                  { l: "Última atualização", v: template.ultimaAtualizacao || "—" },
                  { l: "Tamanho", v: template.tamanho || "—" },
                  { l: "Formato", v: template.formato || "—" },
                  { l: "Licença", v: template.licenca || "Comercial" },
                ].map(s => (
                  <div key={s.l} style={{ padding: 10, background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 5 }}>
                    <div className="uppercase-label" style={{ fontSize: 9.5 }}>{s.l}</div>
                    <div className="mono" style={{ fontSize: 11.5, color: "var(--fg-1)", marginTop: 4 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SCREEN PRINCIPAL — Templates
// ============================================================
const MarketplaceScreen = () => {
  const [cat, setCat] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("popular");
  const [opened, setOpened] = React.useState(null);

  // Pega os templates do window (carregados de templates-data.js)
  const ALL = window.TEMPLATES || [];
  const CATS = window.TEMPLATE_CATEGORIES || [{ id: "all", label: "Todos", count: 0 }];

  let filtered = ALL;
  if (cat !== "all") filtered = filtered.filter(p => p.categoria === cat);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.nome.toLowerCase().includes(s) ||
      p.descricao.toLowerCase().includes(s)
    );
  }
  if (sort === "popular") filtered = [...filtered]; // mantém ordem
  else if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.preco - b.preco);
  else if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.preco - a.preco);
  else if (sort === "newest") filtered = [...filtered].reverse();

  // Featured = primeiro com badge "Best seller" ou primeiro da lista
  const featured = ALL.find(p => p.badge === "Best seller") || ALL[0];

  // Destacados = todos com badge
  const destacados = ALL.filter(p => p.badge && p.badge.trim()).slice(0, 4);

  return (
    <div style={{ padding: "20px 22px 60px" }}>
      {/* Hero search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
            Templates
          </h2>
          <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 4 }}>
            {ALL.length} templates premium · landing pages prontas a usar
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0 12px", height: 36, width: 320,
            background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 6,
          }}>
            <Icon name="search" size={14} style={{ color: "var(--fg-2)" }}/>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar templates..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--fg-0)" }}/>
            <Kbd>⌘F</Kbd>
          </div>
        </div>
      </div>

      {/* Featured hero */}
      {featured && !search && cat === "all" && (
        <div style={{ marginBottom: 22 }}>
          <FeaturedHero template={featured} onOpen={setOpened}/>
        </div>
      )}

      {/* Categorias */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            padding: "7px 12px",
            background: cat === c.id ? "var(--bg-3)" : "var(--bg-2)",
            border: "1px solid " + (cat === c.id ? "var(--accent)" : "var(--line)"),
            borderRadius: 5,
            color: cat === c.id ? "var(--fg-0)" : "var(--fg-1)",
            fontSize: 12, display: "inline-flex", alignItems: "center", gap: 7,
            transition: "all 0.12s",
            cursor: "pointer",
          }}>
            {c.label}
            <span className="mono" style={{ fontSize: 9.5, color: cat === c.id ? "var(--accent)" : "var(--fg-3)" }}>{c.count}</span>
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
          height: 32, padding: "0 10px",
          background: "var(--bg-2)", border: "1px solid var(--line-2)",
          borderRadius: 5, color: "var(--fg-1)", fontSize: 12,
          cursor: "pointer",
        }}>
          <option value="popular">Mais populares</option>
          <option value="newest">Mais recentes</option>
          <option value="price-asc">Preço · ↑</option>
          <option value="price-desc">Preço · ↓</option>
        </select>
      </div>

      {/* Destaques */}
      {cat === "all" && !search && destacados.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="zap" size={14} style={{ color: "var(--accent)" }}/>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>Destaques</h3>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {destacados.map(p => <TemplateCard key={p.id} template={p} onOpen={setOpened}/>)}
          </div>
        </div>
      )}

      {/* Grid principal */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
          {cat === "all" ? "Todos os templates" : cat}
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginLeft: 8 }}>{filtered.length} resultados</span>
        </h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {filtered.map(p => <TemplateCard key={p.id} template={p} onOpen={setOpened}/>)}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-2)", border: "1px dashed var(--line-2)", borderRadius: 8 }}>
          Nenhum template corresponde à pesquisa.
        </div>
      )}

      <TemplateDetail template={opened} onClose={() => setOpened(null)}/>
    </div>
  );
};

window.MarketplaceScreen = MarketplaceScreen;
