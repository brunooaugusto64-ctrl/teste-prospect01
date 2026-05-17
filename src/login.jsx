// Tela de Login, Cadastro e Esqueci Senha — Prospect IA
// Visual: cinematográfico dark + amarelo/preto, mapa-mundi sutil de fundo

const LoginScreen = () => {
  const [mode, setMode] = React.useState("login"); // "login" | "signup" | "forgot" | "reset-sent" | "reset-password"
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  // Detecta se está vindo de link de reset de senha
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      setMode("reset-password");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signup") {
        const { data, error } = await window.supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.user) {
          setSuccess("Conta criada com sucesso! Verifique seu email para confirmar.");
          setMode("login");
          setPassword("");
        }
      } else if (mode === "login") {
        const { error } = await window.supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // O App.jsx detecta o login e troca de tela automaticamente
      } else if (mode === "forgot") {
        const { error } = await window.supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMode("reset-sent");
      } else if (mode === "reset-password") {
        const { error } = await window.supabase.auth.updateUser({ password });
        if (error) throw error;
        setSuccess("Senha redefinida com sucesso! Você já está logado.");
        // Limpa o hash da URL
        window.history.replaceState({}, "", window.location.pathname);
        setTimeout(() => {
          // App.jsx vai detectar a sessão automaticamente
        }, 1500);
      }
    } catch (err) {
      // Traduz mensagens comuns do Supabase
      let msg = err.message;
      if (msg.includes("Invalid login credentials")) msg = "Email ou senha incorretos.";
      if (msg.includes("Email not confirmed")) msg = "Email ainda não confirmado. Verifique sua caixa de entrada.";
      if (msg.includes("User already registered")) msg = "Este email já está cadastrado. Faça login.";
      if (msg.includes("Password should be at least")) msg = "A senha deve ter pelo menos 6 caracteres.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  // Títulos e textos por modo
  const TEXTS = {
    login: {
      title: "Entrar",
      subtitle: "Acesse sua conta Prospect IA",
      submit: "Entrar",
      submitLoading: "Entrando...",
    },
    signup: {
      title: "Criar conta",
      subtitle: "Comece grátis com 50 leads/mês",
      submit: "Criar conta",
      submitLoading: "Criando...",
    },
    forgot: {
      title: "Esqueci minha senha",
      subtitle: "Vamos enviar um link de recuperação",
      submit: "Enviar link",
      submitLoading: "Enviando...",
    },
    "reset-sent": {
      title: "Verifique seu email",
      subtitle: "Enviamos um link de recuperação",
      submit: null,
      submitLoading: null,
    },
    "reset-password": {
      title: "Nova senha",
      subtitle: "Escolha uma senha nova e segura",
      submit: "Redefinir senha",
      submitLoading: "Redefinindo...",
    },
  };

  const t = TEXTS[mode];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--bg-0, #0a0b0d)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background animado — partículas / grid */}
      <BackgroundCinematic/>

      {/* Coluna esquerda — branding (esconde em mobile) */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        position: "relative",
        zIndex: 2,
      }} className="login-branding">
        {/* Logo topo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            background: "var(--accent)",
            borderRadius: 7,
            display: "grid", placeItems: "center",
            color: "var(--accent-fg)",
            boxShadow: "0 0 20px color-mix(in oklab, var(--accent) 50%, transparent)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2 L4 7 L12 12 L20 7 Z"/>
              <path d="M4 12 L12 17 L20 12"/>
              <path d="M4 17 L12 22 L20 17"/>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>Prospect IA</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "0.06em" }}>v0.1 · BETA</span>
          </div>
        </div>

        {/* Conteúdo central — mensagem de venda */}
        <div style={{ maxWidth: 460 }}>
          <div className="mono" style={{
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 18,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }}/>
            Geração de leads com IA
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 42,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            margin: 0,
            marginBottom: 18,
          }}>
            Pare de caçar clientes.<br/>
            <span style={{ color: "var(--accent)" }}>Agora eles chegam até você.</span>
          </h1>
          <p style={{
            fontSize: 15,
            color: "var(--fg-1)",
            lineHeight: 1.55,
            margin: 0,
            marginBottom: 26,
          }}>
            Encontre leads qualificados no Google Maps em segundos. Saia da guerra por preço nos apps de freelance e comece a escolher com quem quer trabalhar.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 28, marginTop: 8 }}>
            <div>
              <div className="tabular" style={{
                fontSize: 26, fontWeight: 600,
                fontFamily: "var(--font-display)",
                color: "var(--accent)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}>90s</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-2)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Para 50 leads
              </div>
            </div>
            <div style={{ width: 1, background: "var(--line)" }}/>
            <div>
              <div className="tabular" style={{
                fontSize: 26, fontWeight: 600,
                fontFamily: "var(--font-display)",
                color: "var(--accent)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}>50</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-2)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Leads grátis/mês
              </div>
            </div>
            <div style={{ width: 1, background: "var(--line)" }}/>
            <div>
              <div className="tabular" style={{
                fontSize: 26, fontWeight: 600,
                fontFamily: "var(--font-display)",
                color: "var(--accent)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}>0</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-2)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Cartão necessário
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mono" style={{
          fontSize: 10,
          color: "var(--fg-3)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          © 2026 Prospect IA · Pagamento seguro Stripe
        </div>
      </div>

      {/* Coluna direita — formulário */}
      <div style={{
        width: 460,
        background: "var(--bg-1)",
        borderLeft: "1px solid var(--line-2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 44px",
        position: "relative",
        zIndex: 2,
        boxShadow: "-20px 0 40px rgba(0,0,0,0.3)",
      }} className="login-form">
        {/* Logo (só aparece quando esconde branding em mobile) */}
        <div className="login-form-logo" style={{
          display: "none",
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
          justifyContent: "center",
        }}>
          <div style={{
            width: 28, height: 28,
            background: "var(--accent)",
            borderRadius: 6,
            display: "grid", placeItems: "center",
            color: "var(--accent-fg)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2 L4 7 L12 12 L20 7 Z"/>
              <path d="M4 12 L12 17 L20 12"/>
              <path d="M4 17 L12 22 L20 17"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Prospect IA</span>
        </div>

        {/* Título */}
        <div style={{ marginBottom: 26 }}>
          <h2 style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}>{t.title}</h2>
          <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 6 }}>
            {t.subtitle}
          </div>
        </div>

        {/* Tabs (só pra login/signup) */}
        {(mode === "login" || mode === "signup") && (
          <div style={{
            display: "flex", gap: 4, padding: 3,
            background: "var(--bg-2)",
            border: "1px solid var(--line)",
            borderRadius: 6,
            marginBottom: 22,
          }}>
            {[
              { id: "login", label: "Entrar" },
              { id: "signup", label: "Criar conta" },
            ].map(m => (
              <button key={m.id} onClick={() => switchMode(m.id)}
                type="button"
                style={{
                  flex: 1, padding: "8px 12px",
                  background: mode === m.id ? "var(--bg-3)" : "transparent",
                  border: "1px solid " + (mode === m.id ? "var(--line-2)" : "transparent"),
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: mode === m.id ? 500 : 400,
                  color: mode === m.id ? "var(--fg-0)" : "var(--fg-2)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* Sucesso (mensagem verde) */}
        {success && (
          <div style={{
            padding: "10px 14px",
            background: "color-mix(in oklab, var(--good) 12%, var(--bg-2))",
            border: "1px solid color-mix(in oklab, var(--good) 40%, var(--line-2))",
            borderRadius: 6,
            fontSize: 12.5,
            color: "var(--good)",
            marginBottom: 16,
            display: "flex", alignItems: "flex-start", gap: 8,
          }}>
            <Icon name="check" size={14} style={{ marginTop: 2, flexShrink: 0 }}/>
            <span>{success}</span>
          </div>
        )}

        {/* Estado: link enviado (esqueci senha) */}
        {mode === "reset-sent" ? (
          <div>
            <div style={{
              padding: 18,
              background: "var(--bg-2)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              textAlign: "center",
              marginBottom: 18,
            }}>
              <div style={{
                width: 48, height: 48,
                margin: "0 auto 14px",
                borderRadius: 10,
                background: "color-mix(in oklab, var(--accent) 12%, var(--bg-3))",
                border: "1px solid color-mix(in oklab, var(--accent) 30%, var(--line-2))",
                display: "grid", placeItems: "center",
                color: "var(--accent)",
              }}>
                <Icon name="check" size={22}/>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
                Link enviado!
              </div>
              <div style={{ fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.5 }}>
                Enviamos um email para <strong style={{ color: "var(--fg-0)" }}>{email}</strong> com um link para redefinir sua senha.
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 10, lineHeight: 1.5 }}>
                Não recebeu? Verifique a caixa de spam ou aguarde alguns minutos.
              </div>
            </div>

            <button
              onClick={() => switchMode("login")}
              type="button"
              style={{
                width: "100%",
                height: 40,
                background: "transparent",
                color: "var(--fg-1)",
                border: "1px solid var(--line-2)",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}>
              Voltar ao login
            </button>
          </div>
        ) : (
          /* Form normal */
          <form onSubmit={handleSubmit}>
            {/* Nome (só no signup) */}
            {mode === "signup" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: "block", fontSize: 11, color: "var(--fg-2)",
                  marginBottom: 6, fontFamily: "var(--font-mono)",
                  letterSpacing: "0.04em", textTransform: "uppercase",
                }}>Nome</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Seu nome completo"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--line-2)"}
                />
              </div>
            )}

            {/* Email (todos exceto reset-password) */}
            {mode !== "reset-password" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: "block", fontSize: 11, color: "var(--fg-2)",
                  marginBottom: 6, fontFamily: "var(--font-mono)",
                  letterSpacing: "0.04em", textTransform: "uppercase",
                }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--line-2)"}
                />
              </div>
            )}

            {/* Senha (login, signup, reset-password) */}
            {(mode === "login" || mode === "signup" || mode === "reset-password") && (
              <div style={{ marginBottom: mode === "login" ? 6 : 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{
                    fontSize: 11, color: "var(--fg-2)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.04em", textTransform: "uppercase",
                  }}>
                    {mode === "reset-password" ? "Nova senha" : "Senha"}
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      style={{
                        background: "transparent", border: "none",
                        color: "var(--accent)",
                        fontSize: 11,
                        cursor: "pointer",
                        padding: 0,
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                      }}>
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={mode === "signup" ? "Mínimo 6 caracteres" : "Sua senha"}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--line-2)"}
                />
                {mode === "signup" && (
                  <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 6 }}>
                    Use pelo menos 6 caracteres. Misture letras e números.
                  </div>
                )}
              </div>
            )}

            {/* Espaço extra no login */}
            {mode === "login" && <div style={{ height: 12 }}/>}

            {/* Erro */}
            {error && (
              <div style={{
                padding: "10px 14px",
                background: "color-mix(in oklab, var(--bad) 12%, transparent)",
                border: "1px solid color-mix(in oklab, var(--bad) 40%, transparent)",
                borderRadius: 6,
                fontSize: 12,
                color: "var(--bad)",
                marginBottom: 14,
                display: "flex", alignItems: "flex-start", gap: 8,
              }}>
                <Icon name="x" size={14} style={{ marginTop: 2, flexShrink: 0 }}/>
                <span>{error}</span>
              </div>
            )}

            {/* Botão submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: 42,
                background: "var(--accent)",
                color: "var(--accent-fg)",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.15s",
                boxShadow: "0 0 0 0 var(--accent)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = "0 0 16px color-mix(in oklab, var(--accent) 40%, transparent)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 0 var(--accent)";
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: "2px solid currentColor", borderTopColor: "transparent",
                    animation: "spin 0.6s linear infinite",
                  }}/>
                  {t.submitLoading}
                </>
              ) : (
                t.submit
              )}
            </button>

            {/* Voltar (só no esqueci senha) */}
            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => switchMode("login")}
                style={{
                  width: "100%",
                  marginTop: 10,
                  height: 36,
                  background: "transparent",
                  color: "var(--fg-2)",
                  border: "none",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}>
                ← Voltar ao login
              </button>
            )}
          </form>
        )}

        {/* Termos (só no signup) */}
        {mode === "signup" && (
          <div style={{
            marginTop: 18,
            fontSize: 11,
            color: "var(--fg-3)",
            textAlign: "center",
            lineHeight: 1.5,
          }}>
            Ao criar conta, você concorda com os <a href="#" style={{ color: "var(--fg-2)", textDecoration: "underline" }}>Termos de Uso</a> e <a href="#" style={{ color: "var(--fg-2)", textDecoration: "underline" }}>Política de Privacidade</a>.
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseAccent {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* Mobile: esconde branding, centraliza form */
        @media (max-width: 900px) {
          .login-branding {
            display: none !important;
          }
          .login-form {
            width: 100% !important;
            max-width: 440px !important;
            margin: 0 auto !important;
            border-left: none !important;
            box-shadow: none !important;
          }
          .login-form-logo {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

// Estilo dos inputs (compartilhado)
const inputStyle = {
  width: "100%", padding: "11px 14px",
  background: "var(--bg-2)",
  border: "1px solid var(--line-2)",
  borderRadius: 6,
  fontSize: 13.5,
  color: "var(--fg-0)",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

// Background cinematográfico — partículas + grid sutil
const BackgroundCinematic = () => {
  return (
    <>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--accent) 8%, transparent), transparent 50%),
          radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--accent) 5%, transparent), transparent 50%)
        `,
        pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }}/>
      {/* Pontos pulsantes decorativos */}
      <div style={{
        position: "absolute",
        top: "25%", left: "15%",
        width: 6, height: 6,
        borderRadius: "50%",
        background: "var(--accent)",
        boxShadow: "0 0 12px var(--accent)",
        animation: "pulseAccent 2.5s ease-in-out infinite",
        pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute",
        top: "60%", left: "8%",
        width: 4, height: 4,
        borderRadius: "50%",
        background: "var(--accent)",
        boxShadow: "0 0 10px var(--accent)",
        animation: "pulseAccent 3s ease-in-out infinite 0.7s",
        pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute",
        top: "45%", left: "35%",
        width: 5, height: 5,
        borderRadius: "50%",
        background: "var(--accent)",
        boxShadow: "0 0 10px var(--accent)",
        animation: "pulseAccent 2.2s ease-in-out infinite 1.3s",
        pointerEvents: "none",
      }}/>
    </>
  );
};

window.LoginScreen = LoginScreen;