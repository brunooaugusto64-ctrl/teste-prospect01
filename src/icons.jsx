// Inline SVG icons — stroke-based, telemetry feel
const Icon = ({ name, size = 14, className = "", style = {} }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.6,
    strokeLinecap: "round", strokeLinejoin: "round",
    className, style,
  };
  switch (name) {
    case "search": return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "grid": return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "users": return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "funnel": return <svg {...props}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>;
    case "sparkles": return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "plug": return <svg {...props}><path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0V8zM12 17v5"/></svg>;
    case "bolt": return <svg {...props}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>;
    case "card": return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;
    case "settings": return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "filter": return <svg {...props}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>;
    case "more": return <svg {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
    case "chevron-down": return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 18 6-6-6-6"/></svg>;
    case "external": return <svg {...props}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>;
    case "check": return <svg {...props}><path d="M20 6 9 17l-5-5"/></svg>;
    case "x": return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "phone": return <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case "globe": return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "star": return <svg {...props}><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
    case "map-pin": return <svg {...props}><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "trend-up": return <svg {...props}><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>;
    case "trend-down": return <svg {...props}><path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/></svg>;
    case "play": return <svg {...props}><path d="m6 3 14 9-14 9V3z"/></svg>;
    case "pause": return <svg {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
    case "tag": return <svg {...props}><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/></svg>;
    case "logout": return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>;
    case "command": return <svg {...props}><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>;
    case "bell": return <svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
    case "notion": return <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4.7 3.7 15.6 3l1.4 1.1v15.8l-1.7.9-9.5-6V5.5l-.9-.5-.2-1.3z" opacity=".15"/><path d="M5 4.5h14v15H5z" opacity=".05"/><path d="M6 5h12v14H6V5zm2 2v10l4-3 4 3V7H8z" /></svg>;
    case "google": return <svg {...props}><path d="M21.35 11.1H12v3.83h5.32a4.55 4.55 0 0 1-1.97 3v2.5h3.18c1.86-1.71 2.93-4.23 2.93-7.22 0-.69-.06-1.36-.18-2.01z" stroke="none" fill="currentColor" opacity=".9"/></svg>;
    case "circle": return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
    case "circle-dot": return <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>;
    case "drag": return <svg {...props}><circle cx="9" cy="6" r="1.2" fill="currentColor"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="9" cy="18" r="1.2" fill="currentColor"/><circle cx="15" cy="6" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="18" r="1.2" fill="currentColor"/></svg>;
    case "arrow-right": return <svg {...props}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case "trash": return <svg {...props}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    case "copy": return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case "eye": return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "key": return <svg {...props}><path d="m21 2-9.6 9.6a5.5 5.5 0 1 1-3-3L18 1l3 1zM15 7l3 3"/></svg>;
    case "shield": return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "refresh": return <svg {...props}><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>;
    case "download": return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
    case "zap": return <svg {...props}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>;
    case "store": return <svg {...props}><path d="M3 9h18l-2-5H5L3 9zM4 9v11h16V9M9 13h6"/></svg>;
    case "menu": return <svg {...props}><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
    default: return null;
  }
};

window.Icon = Icon;
