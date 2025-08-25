"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RefreshCw, Trash2, Edit, MoreHorizontal, Repeat } from "lucide-react";
import { useUsuarios } from "../hooks/use-usuarios";
import type { UsuarioDisplay, Usuario } from "../types/usuario";
import { useDataTable } from "../hooks/use-data-table";
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableFilters,
} from "./ui/data-table-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "../hooks/use-toast";
import DeleteWalletModal from "./delete-wallet-modal";
import EditWalletModal from "./edit-wallet-modal";
import ConvertBitcoinModal from "./convert-bitcoin-modal";
import { TableRowsSkeleton } from "./table-rows-skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function DataTableExample() {
  const {
    usuarios,
    loading,
    error,
    refreshUsuarios,
    addUsuario,
    removeUsuario,
    updateUsuario,
    revalidateUsuarios,
  } = useUsuarios();

  const { success, error: showError } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<UsuarioDisplay | null>(
    null
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState<UsuarioDisplay | null>(
    null
  );

  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [usuarioToConvert, setUsuarioToConvert] =
    useState<UsuarioDisplay | null>(null);

  const handleOpenDeleteModal = useCallback((usuario: UsuarioDisplay) => {
    setUsuarioToDelete(usuario);
    setDeleteModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((usuario: UsuarioDisplay) => {
    setUsuarioToEdit(usuario);
    setEditModalOpen(true);
  }, []);

  const handleConvertBitcoin = useCallback((usuario: UsuarioDisplay) => {
    setUsuarioToConvert(usuario);
    setConvertModalOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!usuarioToDelete) return;

    try {
      await removeUsuario(usuarioToDelete.id);
      success(
        "Carteira excluída com sucesso!",
        `A carteira de ${usuarioToDelete.nome} ${usuarioToDelete.sobrenome} foi removida.`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao excluir carteira";
      showError("Erro ao excluir carteira", errorMessage);
      throw err;
    }
  };

  const handleConfirmUpdate = async (usuarioAtualizado: Usuario) => {
    try {
      await updateUsuario(usuarioAtualizado);
    } catch (err) {
      throw err;
    }
  };

  const columns = useMemo<ColumnDef<UsuarioDisplay>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Selecionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "nome",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nome" />
        ),
        cell: ({ row }) => <div>{row.getValue("nome")}</div>,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          const searchValue = value.toLowerCase();
          const nome = row.getValue("nome")?.toString().toLowerCase() || "";
          const sobrenome =
            row.getValue("sobrenome")?.toString().toLowerCase() || "";
          const email = row.getValue("email")?.toString().toLowerCase() || "";

          return (
            nome.includes(searchValue) ||
            sobrenome.includes(searchValue) ||
            email.includes(searchValue)
          );
        },
      },
      {
        accessorKey: "sobrenome",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sobrenome" />
        ),
        cell: ({ row }) => <div>{row.getValue("sobrenome")}</div>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "bitcoin",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Bitcoin" />
        ),
        cell: ({ row }) => (
          <div className="font-mono">{row.getValue("bitcoin")}</div>
        ),
        enableColumnFilter: true,
      },
      {
        accessorKey: "fiat",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Fiat" />
        ),
        cell: ({ row }) => {
          const usuario = row.original;
          const fiatValue = row.getValue("fiat") as string;

          if (fiatValue !== "N/A" && (usuario.fiatUSD || usuario.fiatEUR)) {
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help font-mono">{fiatValue}</div>
                </TooltipTrigger>
                <TooltipContent className="space-y-1">
                  {usuario.fiatUSD && (
                    <div className="text-xs font-mono">{usuario.fiatUSD}</div>
                  )}
                  {usuario.fiatEUR && (
                    <div className="text-xs font-mono">{usuario.fiatEUR}</div>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div className="font-mono">{fiatValue}</div>;
        },
        enableColumnFilter: true,
      },
      {
        id: "criado_em",
        accessorFn: (row: any) => {
          return row.criado_em ? new Date(row.criado_em) : null;
        },
        header: () => null,
        cell: () => null,
        enableColumnFilter: true,
        show: false,
        filterFn: (row, id, filterValue) => {
          const rowValue = row.getValue(id) as Date;
          if (!rowValue || !filterValue || filterValue.length === 0)
            return true;

          if (filterValue.length === 2) {
            const startDate = new Date(filterValue[0]);
            const endDate = new Date(filterValue[1]);
            return rowValue >= startDate && rowValue <= endDate;
          }

          if (filterValue.length === 1) {
            const filterDate = new Date(filterValue[0]);
            return rowValue.toDateString() === filterDate.toDateString();
          }

          return true;
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const usuario = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleConvertBitcoin(usuario)}>
                  <Repeat className="mr-2 h-4 w-4" />
                  Converter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenEditModal(usuario)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => handleOpenDeleteModal(usuario)}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ];
  }, [handleOpenDeleteModal, handleOpenEditModal, handleConvertBitcoin]);

  const { table, rowSelection } = useDataTable({
    data: usuarios,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    getRowId: (row) => row.id.toString(),
  });

  if (error) {
    return (
      <div className="space-y-4">
        <div></div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <p className="text-destructive">
              Erro ao carregar usuários: {error}
            </p>
            <Button onClick={refreshUsuarios} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"></div>

      <div className=" rounded-xl space-y-4">
        <DataTableFilters
          table={table}
          data={usuarios}
          onWalletAdded={addUsuario}
        />

        <DataTable
          columns={columns}
          data={usuarios}
          table={table}
          loading={loading}
        />

        <DataTablePagination table={table} />
      </div>

      {usuarioToDelete && (
        <DeleteWalletModal
          usuario={usuarioToDelete}
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirmDelete={handleConfirmDelete}
        />
      )}

      {usuarioToEdit && (
        <EditWalletModal
          usuario={usuarioToEdit}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={handleConfirmUpdate}
        />
      )}

      {usuarioToConvert && (
        <ConvertBitcoinModal
          usuario={usuarioToConvert}
          open={convertModalOpen}
          onOpenChange={setConvertModalOpen}
          onSuccess={handleConfirmUpdate}
        />
      )}
    </div>
  );
}
