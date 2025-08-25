import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: number;
          nome: string;
          sobrenome: string;
          email: string;
          endereco: string | null;
          data_nascimento: string;
          data_abertura: string;
          valor_carteira_btc: string;
          endereco_carteira: string;
          moeda_fiat: string | null;
          valor_carteira_fiat: string | null;
          cotacao_btc_fiat: string | null;
          data_cotacao: string | null;
          criado_em: string;
        };
        Insert: {
          id?: number;
          nome: string;
          sobrenome: string;
          email: string;
          endereco?: string | null;
          data_nascimento: string;
          data_abertura: string;
          valor_carteira_btc: string;
          endereco_carteira: string;
          moeda_fiat?: string | null;
          valor_carteira_fiat?: string | null;
          cotacao_btc_fiat?: string | null;
          data_cotacao?: string | null;
          criado_em?: string;
        };
        Update: {
          id?: number;
          nome?: string;
          sobrenome?: string;
          email?: string;
          endereco?: string | null;
          data_nascimento?: string;
          data_abertura?: string;
          valor_carteira_btc?: string;
          endereco_carteira?: string;
          moeda_fiat?: string | null;
          valor_carteira_fiat?: string | null;
          cotacao_btc_fiat?: string | null;
          data_cotacao?: string | null;
          criado_em?: string;
        };
      };
    };
  };
}
