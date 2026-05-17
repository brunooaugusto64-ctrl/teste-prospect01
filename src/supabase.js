// Conexão com o Supabase
// Toda interação com banco/login passa por aqui

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Variáveis de ambiente do Supabase não configuradas. Verifica o arquivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Disponibiliza globalmente também (pros arquivos antigos que usam window.X)
window.supabase = supabase;

console.log("✅ Supabase conectado:", supabaseUrl);