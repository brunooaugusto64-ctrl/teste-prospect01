// Estrutura dos planos do Prospect IA
// Será usado quando integrarmos Stripe (Fase 5)

const PLANS = {
  trial: {
    id: "trial",
    name: "Trial",
    price: 0,
    currency: "EUR",
    description: "Período de teste",
    limits: {
      leads_per_month: 50,
      ai_credits: 200,
      users: 1,
    },
    features: ["Acesso completo", "Sem cartão de crédito"],
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 167,
    currency: "brl",
    description: "Para founders e freelancers",
    limits: {
      leads_per_month: 500,
      ai_credits: 5000,
      users: 1,
    },
    features: [
      "500 leads/mês",
      "5.000 créditos AI",
      "1 utilizador",
      "Sync Notion",
      "Funil básico",
      "Suporte email",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    price: 347,
    currency: "brl",
    description: "Para equipas em crescimento",
    limits: {
      leads_per_month: 2500,
      ai_credits: 25000,
      users: 5,
    },
    features: [
      "2.500 leads/mês",
      "25.000 créditos AI",
      "5 utilizadores",
      "Tudo do Starter",
      "Automações ilimitadas",
      "Webhooks + API",
      "Slack + CRM connectors",
      "Suporte prioritário",
    ],
  },
  scale: {
    id: "scale",
    name: "Scale",
    price: 897,
    currency: "brl",
    description: "Para agências e equipas grandes",
    limits: {
      leads_per_month: 10000,
      ai_credits: 100000,
      users: -1,
    },
    features: [
      "10.000 leads/mês",
      "100.000 créditos AI",
      "Membros ilimitados",
      "Multi-workspace",
      "AI scoring custom",
      "SSO / SAML",
      "SLA 99.9%",
      "Account manager dedicado",
    ],
  },
};

const ADDONS = {
  leads_pack: {
    id: "leads_pack",
    name: "Pacote 1.000 leads extra",
    price: 60,
    currency: "EUR",
    type: "one-time",
    quantity: 1000,
  },
  credits_pack: {
    id: "credits_pack",
    name: "Pacote 10k créditos AI",
    price: 40,
    currency: "EUR",
    type: "one-time",
    quantity: 10000,
  },
  extra_user: {
    id: "extra_user",
    name: "Utilizador adicional",
    price: 29,
    currency: "EUR",
    type: "monthly",
    quantity: 1,
  },
};

// Helper: pega o plano pelo ID
function getPlan(planId) {
  return PLANS[planId] || PLANS.trial;
}

// Disponibiliza globalmente
window.PLANS = PLANS;
window.ADDONS = ADDONS;
window.getPlan = getPlan;