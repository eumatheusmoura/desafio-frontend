export interface Usuario {
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
}

export interface UsuarioDisplay {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  bitcoin: string;
  fiat: string;
  fiatUSD?: string;
  fiatEUR?: string;
  criado_em: string;
  criado_em_formatted: string;
}
