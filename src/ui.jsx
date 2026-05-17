// Shared UI primitives

const Pill = ({ children, color = "var(--fg-2)", style = {}, mono = true }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
    fontSize: 10.5, letterSpacing: mono ? "0.04em" : "0",
    padding: "2px 7px",
    borderRadius: 3,
    border: "1px solid " + color,
    color: color,
    background: "color-mix(in oklab, " + color + " 8%, transparent)",
    textTransform: mono ? "uppercase" : "none",
    lineHeight: 1.4,
    ...style,
  }}>
    {children}
  </span>
);

const Dot = ({ color = "var(--fg-2)", size = 6, pulse = false }) => (
  <span style={{
    width: size, height: size, borderRadius: "50%",
    background: color, display: "inline-block",
    boxShadow: pulse ? `0 0 0 3px color-mix(in oklab, ${color} 25%, transparent)` : "none",
    animation: pulse ? "pulse-dot 1.4s ease-in-out infinite" : "none",
    flexShrink: 0,
  }}/>
);

const Btn = ({ children, variant = "ghost", size = "md", icon, iconRight, onClick, style = {}, disabled, title }) => {
  const sizes = {
    sm: { h: 26, px: 9, fs: 12, gap: 6 },
    md: { h: 32, px: 12, fs: 13, gap: 7 },
    lg: { h: 38, px: 16, fs: 13.5, gap: 8 },
  };
  const s = sizes[size];
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--accent-fg)",
      border: "1px solid var(--accent)",
      fontWeight: 500,
    },
    secondary: {
      background: "var(--bg-3)",
      color: "var(--fg-0)",
      border: "1px solid var(--line-2)",
    },
    ghost: {
      background: "transparent",
      color: "var(--fg-1)",
      border: "1px solid transparent",
    },
    outline: {
      background: "transparent",
      color: "var(--fg-0)",
      border: "1px solid var(--line-2)",
    },
    danger: {
      background: "transparent",
      color: "var(--bad)",
      border: "1px solid color-mix(in oklab, var(--bad) 40%, transparent)",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.fs,
        gap: s.gap,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        whiteSpace: "nowrap",
        transition: "all 0.12s",
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "ghost") e.currentTarget.style.background = "var(--bg-3)";
        else if (variant === "secondary" || variant === "outline") e.currentTarget.style.borderColor = "var(--line-3)";
        else if (variant === "primary") e.currentTarget.style.filter = "brightness(1.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variants[variant].background;
        e.currentTarget.style.borderColor = variants[variant].border.split(" ").pop();
        e.currentTarget.style.filter = "none";
      }}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 12 : 14}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 12 : 14}/>}
    </button>
  );
};

const Card = ({ children, style = {}, padded = false, label }) => (
  <div style={{
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    padding: padded ? 18 : 0,
    position: "relative",
    ...style,
  }}>
    {label && (
      <div style={{
        position: "absolute", top: -7, left: 12,
        fontFamily: "var(--font-mono)",
        fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--fg-2)",
        background: "var(--bg-1)",
        padding: "0 6px",
      }}>{label}</div>
    )}
    {children}
  </div>
);

// Score visualization — vertical bars
const ScoreBars = ({ score, size = "md" }) => {
  const bars = 5;
  const filled = Math.round((score / 100) * bars);
  const heights = size === "sm" ? [5, 7, 9, 11, 13] : [6, 9, 12, 15, 18];
  const w = size === "sm" ? 2 : 3;
  const color = score >= 85 ? "var(--accent)" : score >= 70 ? "var(--fg-1)" : score >= 50 ? "var(--fg-2)" : "var(--fg-3)";
  return (
    <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: heights[heights.length - 1] }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: w, height: h,
          background: i < filled ? color : "var(--line-2)",
          borderRadius: 1,
        }}/>
      ))}
    </div>
  );
};

const ScoreCircle = ({ score, size = 44 }) => {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 85 ? "var(--accent)" : score >= 70 ? "var(--info)" : score >= 50 ? "var(--warn)" : "var(--fg-3)";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--line-2)" strokeWidth="2" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="2" fill="none"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}/>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono)", fontSize: size > 50 ? 14 : 11,
        fontWeight: 500, color: color,
      }} className="tabular">{score}</div>
    </div>
  );
};

const Sparkline = ({ data, color = "var(--accent)", w = 80, h = 24 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.08"/>
    </svg>
  );
};

const Toggle = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    style={{
      width: 30, height: 17,
      background: on ? "var(--accent)" : "var(--bg-4)",
      border: "1px solid " + (on ? "var(--accent)" : "var(--line-2)"),
      borderRadius: 999,
      position: "relative",
      cursor: "pointer",
      padding: 0,
      transition: "all 0.16s",
    }}
  >
    <span style={{
      position: "absolute",
      top: 1, left: on ? 14 : 1,
      width: 13, height: 13,
      background: on ? "var(--accent-fg)" : "var(--fg-1)",
      borderRadius: "50%",
      transition: "left 0.16s",
    }}/>
  </button>
);

const Kbd = ({ children }) => (
  <kbd style={{
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    padding: "2px 5px",
    border: "1px solid var(--line-2)",
    borderRadius: 3,
    background: "var(--bg-3)",
    color: "var(--fg-1)",
    boxShadow: "0 1px 0 var(--line-2)",
  }}>{children}</kbd>
);

const TopBarSearch = ({ onCmd }) => (
  <button
    onClick={onCmd}
    style={{
      display: "flex", alignItems: "center", gap: 8,
      height: 30, padding: "0 10px",
      background: "var(--bg-2)",
      border: "1px solid var(--line)",
      borderRadius: 5,
      width: 280,
      color: "var(--fg-2)",
      fontSize: 12,
      cursor: "pointer",
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--line-2)"}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--line)"}
  >
    <Icon name="search" size={13}/>
    <span style={{ flex: 1, textAlign: "left" }}>Pesquisar ou comando...</span>
    <Kbd>⌘K</Kbd>
  </button>
);

Object.assign(window, { Pill, Dot, Btn, Card, ScoreBars, ScoreCircle, Sparkline, Toggle, Kbd, TopBarSearch });
