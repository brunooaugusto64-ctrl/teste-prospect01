// Carrega React e ReactDOM como globais (pra os arquivos antigos enxergarem)
import React from "react";
import ReactDOM from "react-dom/client";
import "./supabase.js";
import "./plans.js";
import "./templates-data.js";

window.React = React;
window.ReactDOM = ReactDOM;

// Carrega seus arquivos na ORDEM CERTA
// import "./tweaks-panel.jsx";
import "./data.jsx";
import "./icons.jsx";
import "./ui.jsx";
import "./shell.jsx";
import "./geo-card.jsx";
import "./screen-overview.jsx";
import "./screen-leads.jsx";
import "./screen-extract.jsx";
import "./screen-funnel-scoring.jsx";
import "./screen-rest.jsx";
import "./screen-marketplace.jsx";
import "./overlays.jsx";
import "./login.jsx";
import "./app.jsx";
