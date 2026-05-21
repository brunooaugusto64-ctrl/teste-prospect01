// Extract Modal — webhook n8n + AUTH + LIMITES + bloqueio preventivo

const N8N_WEBHOOK_URL = "https://kujoy.app.n8n.cloud/webhook/a394b33c-3538-4f11-aed0-d0d184301535";
const N8N_WEBHOOK_TOKEN = "prospect-ia-secret-s7xq0aldxccvbvivtf91";

const PLAN_LIMITS_EXTRACT = {
  free: 50,  
  starter: 250,
  growth: 600,
  scale: 1500,
};

const PLAN_LABELS = {
  free: "Free",
  starter: "Starter",
  growth: "Growth",
  scale: "Scale",
};

// Default quando prompt não tem número claro
const DEFAULT_LEADS_PER_PROMPT = 10;

// Extrai o número de leads do prompt do user
// "10 cafés em BH" → 10
// "vinte clínicas" → 20
// "cafés em BH" → 10 (default)
// "300 dentistas" → 300 (mesmo se passar do limite, vai bloquear)
const extractLeadCount = (prompt) => {
  if (!prompt) return DEFAULT_LEADS_PER_PROMPT;

  // Tenta achar um número direto no início ou meio da frase
  const numMatch = prompt.match(/\b(\d{1,4})\b/);
  if (numMatch) {
    const n = parseInt(numMatch[1], 10);
    if (n > 0 && n <= 1500) return n;
  }

  // Tenta achar números por extenso comuns em português
  const wordsToNum = {
    "um": 1, "uma": 1, "dois": 2, "duas": 2, "três": 3, "tres": 3,
    "quatro": 4, "cinco": 5, "seis": 6, "sete": 7, "oito": 8, "nove": 9,
    "dez": 10, "onze": 11, "doze": 12, "treze": 13, "catorze": 14, "quatorze": 14,
    "quinze": 15, "dezesseis": 16, "dezassete": 17, "dezoito": 18, "dezenove": 19,
    "vinte": 20, "trinta": 30, "quarenta": 40, "cinquenta": 50,
    "sessenta": 60, "setenta": 70, "oitenta": 80, "noventa": 90,
    "cem": 100, "cento": 100, "duzentos": 200, "trezentos": 300,
    "quinhentos": 500, "mil": 1000,
  };

  const lowerPrompt = prompt.toLowerCase();
  for (const [word, num] of Object.entries(wordsToNum)) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(lowerPrompt)) return num;
  }

  return DEFAULT_LEADS_PER_PROMPT;
};

const ExtractModal = ({ open, onClose, onComplete }) => {
  const [phase, setPhase] = React.useState("idle"); // idle | checking | sending | sent | error | blocked
  const [prompt, setPrompt] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [usage, setUsage] = React.useState(null); // { used, limit, plan, requested }
  const inputRef = React.useRef(null);

  const SAMPLES = [
    "10 clínicas de estética em Lisboa",
    "20 restaurantes vegan no Porto",
    "15 academias em Cascais",
    "8 dentistas em Braga",
  ];

  React.useEffect(() => {
    if (open) {
      loadUsage();
      if (inputRef.current) inputRef.current.focus();
    }
    if (!open) {
      setPhase("idle");
      setPrompt("");
      setErrorMsg(null);
    }
  }, [open]);

  const loadUsage = async () => {
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      if (!user) return;

      const { data: sub } = await window.supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .maybeSingle();

      const plan = sub?.plan || "free";
      const limit = PLAN_LIMITS_EXTRACT[plan] || 50;

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count } = await window.supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo);

      setUsage({ used: count || 0, limit, plan, requested: 0 });
    } catch (err) {
      console.error("Erro ao carregar uso:", err);
    }
  };

  const goToBilling = () => {
    onClose();
    window.dispatchEvent(new CustomEvent("navigate", { detail: { screen: "billing" } }));
  };

  const start = async () => {
    console.log("🟢 [1] start chamado, prompt:", prompt);

    if (!prompt.trim()) return;

    setPhase("checking");
    setErrorMsg(null);

    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada. Faz login novamente.");

      // VERIFICA LIMITE PREVENTIVAMENTE
      const { data: sub } = await window.supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .maybeSingle();

      const plan = sub?.plan || "free";
      const limit = PLAN_LIMITS_EXTRACT[plan] || 50;

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count } = await window.supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo);

      const used = count || 0;
      const requested = extractLeadCount(prompt);
      const wouldBe = used + requested;

      console.log(`🟢 plano=${plan}, usado=${used}, pedido=${requested}, ficaria=${wouldBe}, limite=${limit}`);

      // BLOQUEIO PREVENTIVO: se executando ESSE prompt vai passar do limite
      if (wouldBe > limit) {
        console.log("🔴 BLOQUEIO PREVENTIVO");
        setUsage({ used, limit, plan, requested });
        setPhase("blocked");
        return;
      }

      setPhase("sending");

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${N8N_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify({
          chatInput: prompt,
          user_id: user.id,
          user_email: user.email,
        }),
      });

      console.log("🟢 status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        if (response.status === 401 || response.status === 403) {
          throw new Error("Autenticação falhou no webhook n8n.");
        }
        throw new Error(`n8n erro ${response.status}: ${text}`);
      }

      await response.text();
      setPhase("sent");
    } catch (err) {
      console.error("🔴 erro:", err);
      setErrorMsg(err.message);
      setPhase("error");
    }
  };

  if (!open) return null;

  const usagePct = usage ? Math.min((usage.used / usage.limit) * 100, 100) : 0;
  const usageNearLimit = usagePct >= 80;
  const usageColor = usagePct >= 95 ? "var(--bad)" : usagePct >= 80 ? "var(--warn, #f59e0b)" : "var(--accent)";
  const remaining = usage ? Math.max(0, usage.limit - usage.used) : 0;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(5,7,10,0.78)",
      backdropFilter: "blur(4px)",
      display: "grid", placeItems: "center",
      animation: "fade-in 0.2s",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 600, maxHeight: "85vh",
        background: "var(--bg-2)",
        border: "1px solid var(--line-2)",
        borderRadius: 10,
        boxShadow: "var(--shadow-2)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        animation: "slide-up 0.25s ease-out",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--line)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 5,
            background: "var(--accent)", color: "var(--accent-fg)",
            display: "grid", placeItems: "center",
          }}>
            <Icon name="search" size={14}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Extrair leads do Google Maps</div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-2)", marginTop: 1 }}>
              Descreve em linguagem natural o que queres
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, display: "grid", placeItems: "center",
            background: "transparent", border: "1px solid var(--line-2)", borderRadius: 5,
            color: "var(--fg-2)", cursor: "pointer",
          }}><Icon name="x" size={13}/></button>
        </div>

        {/* Barra de uso (sempre visível quando idle) */}
        {usage && phase === "idle" && (
          <div style={{
            padding: "12px 20px",
            background: "var(--bg-1)",
            borderBottom: "1px solid var(--line)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span className="uppercase-label" style={{ fontSize: 9.5 }}>
                Plano {PLAN_LABELS[usage.plan]} · uso 30 dias
              </span>
              <span className="mono tabular" style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-0)" }}>
                {usage.used} / {usage.limit}
              </span>
            </div>
            <div style={{
              height: 4, background: "var(--bg-3)",
              borderRadius: 2, overflow: "hidden",
            }}>
              <div style={{
                width: `${usagePct}%`,
                height: "100%",
                background: usageColor,
                borderRadius: 2,
                transition: "width 0.6s ease-out",
                boxShadow: usageNearLimit ? `0 0 6px ${usageColor}` : "none",
              }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 10.5, color: "var(--fg-2)" }}>
                Restam <strong style={{ color: usageNearLimit ? usageColor : "var(--fg-0)" }}>{remaining}</strong> leads disponíveis
              </span>
              {usageNearLimit && (
                <span style={{
                  fontSize: 10.5,
                  color: usagePct >= 95 ? "var(--bad)" : "var(--warn, #f59e0b)",
                }}>
                  {usagePct >= 95 ? "⚠ Quase no limite" : `${Math.round(usagePct)}% usado`}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Estado: BLOQUEADO */}
        {phase === "blocked" && usage && (
          <div style={{ padding: "30px 22px", textAlign: "center" }}>
            <div style={{
              width: 52, height: 52,
              margin: "0 auto 16px",
              borderRadius: "50%",
              background: "color-mix(in oklab, var(--bad) 15%, var(--bg-2))",
              border: "1px solid color-mix(in oklab, var(--bad) 50%, var(--line-2))",
              display: "grid", placeItems: "center",
              color: "var(--bad)",
            }}>
              <Icon name="x" size={24}/>
            </div>
            <div style={{
              fontSize: 17, fontWeight: 600,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.015em",
              marginBottom: 8,
            }}>
              {usage.used >= usage.limit ? "Limite do plano atingido" : "Pedido excede o limite"}
            </div>
            <div style={{
              fontSize: 13, color: "var(--fg-1)",
              maxWidth: 440, margin: "0 auto 18px",
              lineHeight: 1.5,
            }}>
              {usage.used >= usage.limit ? (
                <>
                  Já usaste <strong style={{ color: "var(--fg-0)" }}>{usage.used} de {usage.limit}</strong> leads
                  do plano <strong style={{ color: "var(--fg-0)" }}>{PLAN_LABELS[usage.plan]}</strong> nos últimos 30 dias.
                </>
              ) : (
                <>
                  Tu pediste <strong style={{ color: "var(--fg-0)" }}>{usage.requested}</strong> leads,
                  mas só restam <strong style={{ color: "var(--fg-0)" }}>{Math.max(0, usage.limit - usage.used)}</strong> no
                  teu plano <strong style={{ color: "var(--fg-0)" }}>{PLAN_LABELS[usage.plan]}</strong>.
                </>
              )}
              <br/>Faz upgrade para continuar a gerar leads.
            </div>

            <div style={{
              padding: 14,
              background: "var(--bg-1)",
              border: "1px solid color-mix(in oklab, var(--accent) 30%, var(--line-2))",
              borderRadius: 8,
              maxWidth: 380, margin: "0 auto 16px",
              textAlign: "left",
            }}>
              <div className="uppercase-label" style={{ fontSize: 9.5, color: "var(--accent)" }}>
                Recomendado
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                {usage.plan === "free" && (
                  <>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>Starter</span>
                    <span className="mono tabular" style={{ fontSize: 12, color: "var(--fg-2)" }}>250 leads · €29/mês</span>
                  </>
                )}
                {usage.plan === "starter" && (
                  <>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>Growth</span>
                    <span className="mono tabular" style={{ fontSize: 12, color: "var(--fg-2)" }}>600 leads · €59/mês</span>
                  </>
                )}
                {usage.plan === "growth" && (
                  <>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>Scale</span>
                    <span className="mono tabular" style={{ fontSize: 12, color: "var(--fg-2)" }}>1500 leads · €129/mês</span>
                  </>
                )}
                {usage.plan === "scale" && (
                  <span style={{ fontSize: 13, color: "var(--fg-2)" }}>
                    Já estás no plano máximo. Contacta-nos para limites maiores.
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <Btn variant="ghost" size="md" onClick={onClose}>Fechar</Btn>
              {usage.plan !== "scale" && (
                <Btn variant="primary" size="md" icon="card" iconRight="arrow-right" onClick={goToBilling}>
                  Fazer upgrade
                </Btn>
              )}
            </div>
          </div>
        )}

        {/* Prompt input */}
        {phase !== "blocked" && (
          <div style={{ padding: "20px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px",
              background: "var(--bg-1)",
              border: "1px solid " + (phase === "idle" ? "var(--line-2)" : "var(--accent)"),
              borderRadius: 6,
              transition: "border-color 0.2s",
            }}>
              <span className="mono" style={{ color: "var(--accent)", fontSize: 14 }}>$</span>
              <input
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && phase === "idle") start(); }}
                placeholder="ex: 10 lojas de carros em Lisboa"
                disabled={phase !== "idle"}
                className="mono"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 14, color: "var(--fg-0)",
                  opacity: phase === "idle" ? 1 : 0.7,
                }}
              />
            </div>

            {/* Hint sobre como funciona */}
            {phase === "idle" && prompt && (
              <div style={{ marginTop: 8, fontSize: 10.5, color: "var(--fg-2)" }}>
                <span className="mono">{extractLeadCount(prompt)}</span> leads detectados no pedido
                {usage && (
                  <span> · ficarás com {usage.used + extractLeadCount(prompt)}/{usage.limit}</span>
                )}
              </div>
            )}

            {phase === "idle" && (
              <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="uppercase-label" style={{ marginRight: 4, alignSelf: "center" }}>Sugestões</span>
                {SAMPLES.map(s => (
                  <button key={s} onClick={() => setPrompt(s)} style={{
                    padding: "5px 10px",
                    background: "var(--bg-3)", border: "1px solid var(--line)",
                    borderRadius: 4, fontSize: 11, color: "var(--fg-1)",
                    cursor: "pointer",
                  }}>{s}</button>
                ))}
              </div>
            )}

            {phase === "checking" && (
              <div style={{
                marginTop: 18, padding: 16,
                background: "var(--bg-1)",
                border: "1px solid var(--line)",
                borderRadius: 6,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: "2px solid var(--line-2)", borderTopColor: "var(--accent)",
                  animation: "spin 0.8s linear infinite",
                }}/>
                <div style={{ fontSize: 13, fontWeight: 500 }}>A verificar o teu plano...</div>
              </div>
            )}

            {phase === "sending" && (
              <div style={{
                marginTop: 18, padding: 16,
                background: "var(--bg-1)",
                border: "1px solid var(--line)",
                borderRadius: 6,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: "2px solid var(--line-2)", borderTopColor: "var(--accent)",
                  animation: "spin 0.8s linear infinite",
                }}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Buscando no Google Maps......</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 2 }}>
                    POST {N8N_WEBHOOK_URL.substring(0, 50)}...
                  </div>
                </div>
              </div>
            )}

            {phase === "sent" && (
              <div style={{
                marginTop: 18, padding: 16,
                background: "color-mix(in oklab, var(--good) 10%, var(--bg-1))",
                border: "1px solid color-mix(in oklab, var(--good) 40%, var(--line-2))",
                borderRadius: 6,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Icon name="check" size={16} style={{ color: "var(--good)" }}/>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--good)" }}>Pedido enviado!</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--fg-1)", lineHeight: 1.5 }}>
                  Pedido recebido! A nossa IA está a processar. <br/>
  Aguarda ~60-90 segundos. Os leads vão aparecer na tabela.
                </div>
              </div>
            )}

            {phase === "error" && (
              <div style={{
                marginTop: 18, padding: 16,
                background: "color-mix(in oklab, var(--bad) 10%, var(--bg-1))",
                border: "1px solid color-mix(in oklab, var(--bad) 40%, var(--line-2))",
                borderRadius: 6,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Icon name="x" size={16} style={{ color: "var(--bad)" }}/>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--bad)" }}>Erro ao enviar</span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--fg-1)", marginBottom: 10 }}>
                  {errorMsg || "Não foi possível contactar o n8n."}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {phase !== "blocked" && (
          <div style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--line)",
            background: "var(--bg-1)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            {phase === "idle" && (
              <>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-2)" }}>
                  Enter para enviar
                </span>
                <div style={{ flex: 1 }}/>
                <Btn variant="ghost" size="md" onClick={onClose}>Cancelar</Btn>
                <Btn variant="primary" size="md" onClick={start} iconRight="arrow-right" disabled={!prompt.trim()}>
                  Enviar pedido
                </Btn>
              </>
            )}
            {(phase === "checking" || phase === "sending") && (
              <span className="mono" style={{ fontSize: 11, color: "var(--fg-2)" }}>A processar...</span>
            )}
            {phase === "sent" && (
              <>
                <div style={{ flex: 1 }}/>
                <Btn variant="primary" size="md" onClick={() => {
                  // Salva timestamp da extração pra mostrar mensagem na tela de leads
                  try {
                    localStorage.setItem("extracting_at", String(Date.now()));
                    localStorage.setItem("extracting_count", String(extractLeadCount(prompt)));
                  } catch (e) { /* ignora se localStorage falhar */ }
                  onComplete && onComplete();
                  onClose();
                }}>
                  Ver leads
                </Btn>
              </>
            )}
              <>
                <div style={{ flex: 1 }}/>
                <Btn variant="outline" size="md" onClick={() => setPhase("idle")}>Tentar novamente</Btn>
                <Btn variant="ghost" size="md" onClick={onClose}>Fechar</Btn>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

window.ExtractModal = ExtractModal;
