import { supabase } from "../supabase";
import type { Usuario, UsuarioDisplay } from "../../types/usuario";

export class UsuariosService {
  /**
   * Busca todos os usuários do banco de dados
   */
  static async getUsuarios(): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  }

  /**
   * Converte dados do banco para formato de exibição
   */
  static formatUsuarioForDisplay(usuario: Usuario): UsuarioDisplay {
    const bitcoinValue = parseFloat(usuario.valor_carteira_btc);
    const bitcoinFormatted = bitcoinValue.toFixed(8);

    let fiatFormatted = "N/A";
    let fiatUSD: string | undefined;
    let fiatEUR: string | undefined;

    if (usuario.valor_carteira_fiat && usuario.moeda_fiat) {
      const fiatValue = parseFloat(usuario.valor_carteira_fiat);
      const currency = usuario.moeda_fiat;

      let brlValue: number;

      if (currency === "BRL") {
        brlValue = fiatValue;
      } else if (currency === "USD") {
        brlValue = fiatValue * 5.0;
      } else if (currency === "EUR") {
        brlValue = fiatValue * 5.5;
      } else {
        brlValue = fiatValue;
      }
      fiatFormatted = `R$ ${brlValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      if (currency === "BRL") {
        const usdValue = fiatValue / 5.0;
        const eurValue = fiatValue / 5.5;

        fiatUSD = `$${usdValue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        fiatEUR = `€${eurValue.toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      } else if (currency === "USD") {
        const eurValue = fiatValue * 0.9;

        fiatUSD = `R$ ${brlValue.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        fiatEUR = `€${eurValue.toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      } else if (currency === "EUR") {
        const usdValue = fiatValue * 1.1;

        fiatUSD = `R$ ${brlValue.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        fiatEUR = `$${usdValue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
    }

    const dataCriacao = new Date(usuario.criado_em);
    const dataFormatada = dataCriacao.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      bitcoin: bitcoinFormatted,
      fiat: fiatFormatted,
      fiatUSD,
      fiatEUR,
      criado_em: usuario.criado_em,
      criado_em_formatted: dataFormatada,
    };
  }

  /**
   * Busca usuários e formata para exibição
   */
  static async getUsuariosForDisplay(): Promise<UsuarioDisplay[]> {
    const usuarios = await this.getUsuarios();
    return usuarios.map((usuario) => this.formatUsuarioForDisplay(usuario));
  }

  /**
   * Cria um novo usuário no banco de dados
   */
  static async createUsuario(
    usuario: Omit<Usuario, "id" | "criado_em">
  ): Promise<Usuario> {
    try {
      console.log("Dados sendo enviados para o Supabase:", usuario);

      // Obter o próximo ID disponível
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("usuarios")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      if (maxIdError) {
        console.error("Erro ao obter ID máximo:", maxIdError);
        throw new Error("Erro ao gerar ID do usuário");
      }

      const nextId =
        maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;
      console.log("Próximo ID a ser usado:", nextId);

      const usuarioComId = {
        ...usuario,
        id: nextId,
      };

      const { data, error } = await supabase
        .from("usuarios")
        .insert([usuarioComId])
        .select()
        .single();

      console.log("Resposta do Supabase:", { data, error });

      if (error) {
        console.error("Erro detalhado do Supabase:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        let errorMessage = "Erro ao criar usuário";
        if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        if (error.details) {
          errorMessage += ` (${error.details})`;
        }
        if (error.hint) {
          errorMessage += ` - Dica: ${error.hint}`;
        }

        throw new Error(errorMessage);
      }

      if (!data) {
        throw new Error(
          "Erro ao criar usuário: dados não retornados pelo servidor"
        );
      }

      console.log("Usuário criado com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro na requisição completa:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "Erro desconhecido ao criar usuário. Verifique a conexão com o banco de dados."
      );
    }
  }

  /**
   * Deleta um usuário do banco de dados
   */
  static async deleteUsuario(id: number): Promise<void> {
    try {
      console.log("Deletando usuário com ID:", id);

      const { error } = await supabase.from("usuarios").delete().eq("id", id);

      if (error) {
        console.error("Erro detalhado do Supabase:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        let errorMessage = "Erro ao deletar usuário";
        if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        if (error.details) {
          errorMessage += ` (${error.details})`;
        }
        if (error.hint) {
          errorMessage += ` - Dica: ${error.hint}`;
        }

        throw new Error(errorMessage);
      }

      console.log("Usuário deletado com sucesso, ID:", id);
    } catch (error) {
      console.error("Erro na requisição de delete:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "Erro desconhecido ao deletar usuário. Verifique a conexão com o banco de dados."
      );
    }
  }

  /**
   * Atualiza um usuário no banco de dados
   */
  static async updateUsuario(usuario: Usuario): Promise<Usuario> {
    try {
      console.log("Atualizando usuário com ID:", usuario.id, "Dados:", usuario);

      const { data, error } = await supabase
        .from("usuarios")
        .update({
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email,
          endereco: usuario.endereco,
          data_nascimento: usuario.data_nascimento,
          data_abertura: usuario.data_abertura,
          valor_carteira_btc: usuario.valor_carteira_btc,
          endereco_carteira: usuario.endereco_carteira,
          moeda_fiat: usuario.moeda_fiat,
          valor_carteira_fiat: usuario.valor_carteira_fiat,
          cotacao_btc_fiat: usuario.cotacao_btc_fiat,
          data_cotacao: usuario.data_cotacao,
        })
        .eq("id", usuario.id)
        .select()
        .single();

      console.log("Resposta do Supabase (update):", { data, error });

      if (error) {
        console.error("Erro detalhado do Supabase:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        let errorMessage = "Erro ao atualizar usuário";
        if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        if (error.details) {
          errorMessage += ` (${error.details})`;
        }
        if (error.hint) {
          errorMessage += ` - Dica: ${error.hint}`;
        }

        throw new Error(errorMessage);
      }

      if (!data) {
        throw new Error(
          "Erro ao atualizar usuário: dados não retornados pelo servidor"
        );
      }

      console.log("Usuário atualizado com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro na requisição de update:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "Erro desconhecido ao atualizar usuário. Verifique a conexão com o banco de dados."
      );
    }
  }
}
