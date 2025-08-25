import { useState, useEffect } from "react";
import { UsuariosService } from "../lib/services/usuarios";
import type { UsuarioDisplay, Usuario } from "../types/usuario";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UsuariosService.getUsuariosForDisplay();
      setUsuarios(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar usuários";
      setError(errorMessage);
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const refreshUsuarios = () => {
    fetchUsuarios();
  };

  const addUsuario = (novoUsuario: Usuario) => {
    const usuarioFormatado =
      UsuariosService.formatUsuarioForDisplay(novoUsuario);
    setUsuarios((prev) => [usuarioFormatado, ...prev]);
  };

  const revalidateUsuarios = async () => {
    try {
      const data = await UsuariosService.getUsuariosForDisplay();
      setUsuarios(data);
    } catch (err) {
      console.error("Erro ao revalidar usuários:", err);
    }
  };

  const removeUsuario = async (id: number): Promise<void> => {
    try {
      await UsuariosService.deleteUsuario(id);

      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      throw err;
    }
  };

  const updateUsuario = async (usuarioAtualizado: Usuario): Promise<void> => {
    try {
      const usuarioEditado = await UsuariosService.updateUsuario(
        usuarioAtualizado
      );

      const usuarioFormatado =
        UsuariosService.formatUsuarioForDisplay(usuarioEditado);
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === usuarioEditado.id ? usuarioFormatado : usuario
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      throw err;
    }
  };

  return {
    usuarios,
    loading,
    error,
    refreshUsuarios,
    addUsuario,
    removeUsuario,
    updateUsuario,
    revalidateUsuarios,
  };
}
