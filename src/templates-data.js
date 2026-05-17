// ============================================================
//  TEMPLATES — banco de produtos para venda
//  Editar este arquivo é tudo o que precisas para gerir produtos.
// ============================================================
//
//  Como adicionar/editar um template:
//  1. Copia um bloco { ... } existente
//  2. Cola embaixo, mudando os valores
//  3. Salva (Ctrl+S) — site atualiza sozinho
//
//  Para PRÉ-VISUALIZAR sem ainda ter Stripe configurado:
//  - Deixa stripeLink: "" (vazio)
//  - Botão "Comprar" mostra "Em breve"
//
//  Para HOSPEDAR FOTOS:
//  - Sobe a foto em https://imgur.com/upload (grátis, sem cadastro)
//  - Botão direito na foto → "Copiar endereço da imagem"
//  - Cola URL nos campos "fotoCapa" e "fotosExtras"
//  - Alternativas: Cloudinary, Google Drive público, pasta /public/
//
//  Para criar PAYMENT LINK no Stripe:
//  1. https://dashboard.stripe.com/payment-links
//  2. + Novo Link → preenche nome, preço, descrição
//  3. Stripe gera URL: https://buy.stripe.com/...
//  4. Cola em "stripeLink"
//  5. Stripe trata: checkout, fraude, email automático
// ============================================================

const TEMPLATES = [
  {
    id: "t1",
    nome: "SaaS Landing Vol. 3",
    categoria: "Landing pages",
    descricao: "12 secções modulares para SaaS B2B · Framer + Figma · dark + light",
    descricaoLonga: "Construído para equipas que precisam de uma landing performante em horas, não semanas. Tudo organizado em variáveis: muda 4 valores e tens um rebrand completo em 5 minutos. Inclui 12 secções modulares, modo escuro/claro automático, e documentação completa.",
    preco: 49,
    precoOriginal: 89,
    badge: "Best seller",          // "Best seller" | "Editor's pick" | "Novo" | "Top 10" | ""
    fotoCapa: "",                  // URL da imagem principal (ex: https://i.imgur.com/abc.jpg)
    fotosExtras: ["", "", "", ""], // até 4 fotos adicionais (deixa "" se não tiver)
    stripeLink: "",                // URL do Payment Link do Stripe
    previewLink: "",               // URL da demo online (deixa "" se não tiver)
    formato: ".fig + .pdf",
    licenca: "Comercial",
    tamanho: "24 MB",
    ultimaAtualizacao: "há 6 dias",
    palette: ["#0a0b0d", "#f4f5f7", "#f5b942"],
  },
  {
    id: "t2",
    nome: "Pricing Page Bundle",
    categoria: "Landing pages",
    descricao: "8 layouts de pricing · 3 toggles · mobile-first",
    descricaoLonga: "Coleção de 8 layouts de pricing prontos a copiar. Cada layout tem 3 variantes de toggle (mensal/anual/lifetime), comparação de planos e CTAs otimizados para conversão.",
    preco: 39,
    precoOriginal: null,
    badge: "",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig + .html",
    licenca: "Comercial",
    tamanho: "18 MB",
    ultimaAtualizacao: "há 2 sem",
    palette: ["#0f1114", "#a78bfa", "#f4f5f7"],
  },
  {
    id: "t3",
    nome: "Restaurant Landing Pack",
    categoria: "Landing pages",
    descricao: "5 templates para restaurantes e cafés · menu + booking + reviews",
    descricaoLonga: "Pack com 5 landing pages prontas para restaurantes, cafés e bistrôs. Cada template inclui sistema de menu visual, formulário de reserva e secção de reviews do Google.",
    preco: 35,
    precoOriginal: 59,
    badge: "Novo",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig + .html",
    licenca: "Comercial",
    tamanho: "32 MB",
    ultimaAtualizacao: "há 1 sem",
    palette: ["#1a1208", "#d97706", "#fef3c7"],
  },
  {
    id: "t4",
    nome: "Realtor Landing Vol. 2",
    categoria: "Landing pages",
    descricao: "Imobiliária moderna · listagem + filtros + lead capture",
    descricaoLonga: "Landing page premium para imobiliárias. Inclui sistema de listagem com filtros, formulário de captação de lead, mapa interativo e galeria de imóveis em destaque.",
    preco: 45,
    precoOriginal: null,
    badge: "",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig",
    licenca: "Comercial",
    tamanho: "21 MB",
    ultimaAtualizacao: "há 3 sem",
    palette: ["#0c1117", "#3b82f6", "#f4f5f7"],
  },
  {
    id: "t5",
    nome: "Clinic & Aesthetics Pro",
    categoria: "Landing pages",
    descricao: "Para clínicas estéticas · serviços + booking + before/after",
    descricaoLonga: "Landing page completa para clínicas de estética e bem-estar. Galeria before/after, sistema de booking, lista de serviços com preços e secção de testemunhos animada.",
    preco: 42,
    precoOriginal: 79,
    badge: "Top 10",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig + .html",
    licenca: "Comercial",
    tamanho: "26 MB",
    ultimaAtualizacao: "há 4 dias",
    palette: ["#1a0f1d", "#ec4899", "#fce7f3"],
  },
  {
    id: "t6",
    nome: "Gym & Fitness Landing",
    categoria: "Landing pages",
    descricao: "Academia / personal trainer · planos + horários + lead form",
    descricaoLonga: "Landing dinâmica para academias e personal trainers. Planos de treino, horários de aulas, sistema de captação de leads e secção de transformações.",
    preco: 29,
    precoOriginal: null,
    badge: "",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig",
    licenca: "Comercial",
    tamanho: "19 MB",
    ultimaAtualizacao: "há 1 sem",
    palette: ["#0a0a0a", "#facc15", "#f4f4f5"],
  },
  {
    id: "t7",
    nome: "Agency Landing Vol. 1",
    categoria: "Landing pages",
    descricao: "Agência de marketing/design · portfólio + serviços + cases",
    descricaoLonga: "Landing premium para agências criativas. Inclui showcase de portfólio em grid, secção de cases de sucesso, equipa, processo e formulário de briefing.",
    preco: 55,
    precoOriginal: null,
    badge: "Editor's pick",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig + .pdf",
    licenca: "Comercial",
    tamanho: "28 MB",
    ultimaAtualizacao: "há 2 sem",
    palette: ["#000000", "#ffffff", "#f5b942"],
  },
  {
    id: "t8",
    nome: "Course Landing Pro",
    categoria: "Landing pages",
    descricao: "Para cursos online · curriculum + instrutores + checkout",
    descricaoLonga: "Landing focada em conversão para cursos online. Inclui apresentação do curriculum, perfil de instrutores, depoimentos, FAQ e checkout integrado.",
    preco: 39,
    precoOriginal: 69,
    badge: "",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig + .html",
    licenca: "Comercial",
    tamanho: "23 MB",
    ultimaAtualizacao: "há 5 dias",
    palette: ["#0c0a1d", "#8b5cf6", "#ede9fe"],
  },
  {
    id: "t9",
    nome: "Local Business Pack",
    categoria: "Landing pages",
    descricao: "5 templates para negócios locais · barbearia, pet, oficina",
    descricaoLonga: "Pack com 5 landings prontas para negócios locais: barbearia, pet shop, oficina, café e estética. Cada uma personalizável em 5 minutos via variáveis Figma.",
    preco: 49,
    precoOriginal: 89,
    badge: "Novo",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig",
    licenca: "Comercial",
    tamanho: "35 MB",
    ultimaAtualizacao: "há 3 dias",
    palette: ["#1a1a1a", "#ef4444", "#fef2f2"],
  },
  {
    id: "t10",
    nome: "App Promo Landing",
    categoria: "Landing pages",
    descricao: "Para apps mobile · features + screenshots + download",
    descricaoLonga: "Landing premium para promover apps mobile. Showcase de screenshots em mockup de iPhone, lista de features, depoimentos e CTAs para App Store/Play Store.",
    preco: 35,
    precoOriginal: null,
    badge: "",
    fotoCapa: "",
    fotosExtras: ["", "", "", ""],
    stripeLink: "",
    previewLink: "",
    formato: ".fig",
    licenca: "Comercial",
    tamanho: "22 MB",
    ultimaAtualizacao: "há 1 sem",
    palette: ["#020617", "#06b6d4", "#f0fdfa"],
  },
];

// Não precisas mexer nisto — categorias geradas automaticamente
const TEMPLATE_CATEGORIES = (() => {
  const counts = {};
  TEMPLATES.forEach(t => {
    counts[t.categoria] = (counts[t.categoria] || 0) + 1;
  });
  const cats = [{ id: "all", label: "Todos", count: TEMPLATES.length }];
  Object.entries(counts).forEach(([cat, count]) => {
    cats.push({ id: cat, label: cat, count });
  });
  return cats;
})();

window.TEMPLATES = TEMPLATES;
window.TEMPLATE_CATEGORIES = TEMPLATE_CATEGORIES;
