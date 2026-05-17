// Dados da dashboard — busca do Supabase
// Centraliza todas as queries que a dash precisa

// =====================================================
// DEMO DATA — usado quando o user clica "carregar demo"
// =====================================================
const DEMO_LEADS = [
  { name: "Estética Lumière", phone: "+351 21 314 28 90", website: "lumiere.pt", city: "Lisboa", reviews_count: 312, status: "qualificado" },
  { name: "Bella Pele Studio", phone: "+351 21 442 11 03", website: "bellapele.pt", city: "Lisboa", reviews_count: 188, status: "contactado" },
  { name: "Clínica Aurora", phone: "+351 21 887 33 41", website: "auroraclinica.com", city: "Lisboa", reviews_count: 421, status: "qualificado" },
  { name: "Skin & Co.", phone: "+351 21 332 09 88", website: "skinandco.pt", city: "Lisboa", reviews_count: 96, status: "novo" },
  { name: "MedSpa Avenida", phone: "+351 21 991 02 14", website: "medspaavenida.pt", city: "Lisboa", reviews_count: 244, status: "novo" },
  { name: "Studio Ametista", phone: "+351 21 558 19 02", website: "ametista.pt", city: "Lisboa", reviews_count: 132, status: "contactado" },
  { name: "Clínica Pura", phone: "+351 21 117 88 23", website: "clinicapura.pt", city: "Lisboa", reviews_count: 267, status: "qualificado" },
  { name: "Renova Estética", phone: "+351 21 304 55 67", website: "renova.pt", city: "Lisboa", reviews_count: 198, status: "convertido" },
];

// =====================================================
// FUNÇÕES DE BUSCA — todas vão pro Supabase
// =====================================================

// Pega todos os leads do usuário logado
async function fetchLeads() {
  const { data, error } = await window.supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar leads:", error);
    return [];
  }
  return data || [];
}

// Pega estatísticas (totais, médias, contagens)
async function fetchStats() {
  const { data: leads, error } = await window.supabase
    .from("leads")
    .select("score, status, reviews_count");

  if (error) {
    console.error("Erro ao buscar stats:", error);
    return { total: 0, qualified: 0, converted: 0, avgScore: 0, avgReviews: 0 };
  }

  const total = leads.length;
  const qualified = leads.filter(l => l.status === "qualificado").length;
  const converted = leads.filter(l => l.status === "convertido").length;

  const scoresValid = leads.filter(l => l.score != null);
  const avgScore = scoresValid.length > 0
    ? Math.round(scoresValid.reduce((s, l) => s + l.score, 0) / scoresValid.length * 10) / 10
    : 0;

  const reviewsValid = leads.filter(l => l.reviews_count != null);
  const avgReviews = reviewsValid.length > 0
    ? Math.round(reviewsValid.reduce((s, l) => s + l.reviews_count, 0) / reviewsValid.length)
    : 0;

  return { total, qualified, converted, avgScore, avgReviews };
}

// Pega extrações recentes
async function fetchExtractions() {
  const { data, error } = await window.supabase
    .from("extractions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Erro ao buscar extrações:", error);
    return [];
  }
  return data || [];
}

// Conta leads agrupados por cidade (pro mapa geo)
async function fetchCityCounts() {
  const { data, error } = await window.supabase
    .from("leads")
    .select("city");

  if (error) return [];

  const counts = {};
  data.forEach(l => {
    const c = l.city || "Sem cidade";
    counts[c] = (counts[c] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);
}

// Insere leads de demo (chamado pelo botão "carregar demo")
async function loadDemoData() {
  const { data: { user } } = await window.supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const leadsToInsert = DEMO_LEADS.map(l => ({ ...l, user_id: user.id }));

  const { error } = await window.supabase
    .from("leads")
    .insert(leadsToInsert);

  if (error) {
    console.error("Erro ao inserir demo:", error);
    return { error: error.message };
  }
  return { success: true, count: leadsToInsert.length };
}

// Apaga TODOS os leads do usuário (botão "limpar tudo")
async function clearAllData() {
  const { data: { user } } = await window.supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await window.supabase
    .from("leads")
    .delete()
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

// =====================================================
// EXPORTAR PRA window (pros arquivos antigos usarem)
// =====================================================
window.fetchLeads = fetchLeads;
window.fetchStats = fetchStats;
window.fetchExtractions = fetchExtractions;
window.fetchCityCounts = fetchCityCounts;
window.loadDemoData = loadDemoData;
window.clearAllData = clearAllData;

// LEADS e PROMPTS antigos — DEPRECATED, mantidos vazios pra não quebrar
window.LEADS = [];
window.PROMPTS = [];
window.FUNNEL_STAGES = [
  { id: "novo", label: "Novo", color: "var(--fg-2)", count: 0 },
  { id: "contactado", label: "Contactado", color: "var(--info)", count: 0 },
  { id: "qualificado", label: "Qualificado", color: "var(--accent)", count: 0 },
  { id: "convertido", label: "Convertido", color: "var(--good)", count: 0 },
];
window.AUTOMATIONS = [];