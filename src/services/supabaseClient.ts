/**
 * Cliente Supabase preparado para futura integração com banco de dados em nuvem.
 *
 * Para ativar o Supabase futuramente:
 * 1. Instale o pacote: npm install @supabase/supabase-js
 * 2. Crie um arquivo .env.local na raiz com:
 *    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
 *    VITE_SUPABASE_ANON_KEY=sua-chave-anon
 * 3. Crie uma tabela `saved_configurations` no Supabase e conecte no storageService.ts.
 */
export interface SupabaseEnvConfig {
  url: string | undefined;
  anonKey: string | undefined;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseEnvConfig {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}
