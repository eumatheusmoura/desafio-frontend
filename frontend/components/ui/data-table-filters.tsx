"use client";

import { Table } from "@tanstack/react-table";
import { Eye, WalletCards, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddWalletModal from "../add-wallet-modal";
import type { Usuario } from "../../types/usuario";
import { Input } from "@/components/ui/input";
import { DataTableFilter } from "../data-table-filter/components/data-table-filter";
import { useDataTableFilters } from "../data-table-filter/hooks/use-data-table-filters";
import { filterColumns } from "../filter-config";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  data: TData[];
  onWalletAdded?: (usuario: Usuario) => void;
}

export function DataTableFilters<TData>({
  table,
  data,
  onWalletAdded,
}: DataTableFiltersProps<TData>) {
  const { filters, actions, columns } = useDataTableFilters({
    data,
    columnsConfig: filterColumns as any,
    strategy: "client",
  });

  const getFilterValue = (columnId: string) => {
    return (table.getColumn(columnId)?.getFilterValue() as string) ?? "";
  };

  const setFilterValue = (columnId: string, value: string) => {
    table.getColumn(columnId)?.setFilterValue(value);
  };

  useEffect(() => {
    if (filters.length === 0) {
      table.getColumn("nome")?.setFilterValue(undefined);
      table.getColumn("sobrenome")?.setFilterValue(undefined);
      table.getColumn("email")?.setFilterValue(undefined);
      table.getColumn("criado_em")?.setFilterValue(undefined);
      return;
    }

    const activeFilters = filters.filter(
      (filter) =>
        filter.values &&
        filter.values.length > 0 &&
        (filter.columnId === "criado_em"
          ? filter.values.some((v) => v !== null && v !== undefined)
          : filter.values[0]?.toString().trim() !== "")
    );

    if (activeFilters.length === 0) {
      table.getColumn("nome")?.setFilterValue(undefined);
      table.getColumn("sobrenome")?.setFilterValue(undefined);
      table.getColumn("email")?.setFilterValue(undefined);
      table.getColumn("criado_em")?.setFilterValue(undefined);
      return;
    }

    activeFilters.forEach((filter) => {
      const column = table.getColumn(filter.columnId);
      if (column) {
        if (filter.columnId === "criado_em") {
          column.setFilterValue(filter.values);
        } else {
          const filterValue = filter.values[0]?.toString().trim() || "";
          column.setFilterValue(filterValue);
        }
      }
    });
  }, [filters, table, data]);

  return (
    <div className="space-y-3">
      <div className="py-2 flex items-center justify-between">
        <label
          className="text-base font-mono font-medium
 text-stone-500 uppercase flex items-center gap-2"
        >
          <WalletCards className="text-stone-500 h-5 w-5" />
          BTC Carteiras
        </label>

        <AddWalletModal onSuccess={onWalletAdded}>
          <Button variant="premium" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Adicionar Carteira</span>
            <span className="sm:hidden">Carteira</span>
          </Button>
        </AddWalletModal>
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 flex-1 sm:flex-none">
            <Input
              placeholder="Buscar por nome, sobrenome ou email..."
              value={getFilterValue("nome")}
              onChange={(event) => setFilterValue("nome", event.target.value)}
              className="h-8 flex-1 sm:w-xs bg-white dark:bg-stone-900 text-sm"
            />

            <div className="sm:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-800 flex-shrink-0"
                  >
                    <Sparkles className="h-4 w-4 text-stone-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <p className="text-sm">Analisar com IA</p>
                </PopoverContent>
              </Popover>
            </div>

            <div className="hidden sm:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-800 flex-shrink-0"
                  >
                    <Sparkles className="h-4 w-4 text-stone-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analisar tabela com IA</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          <DataTableFilter
            columns={columns}
            filters={filters}
            actions={actions}
            strategy="client"
            locale="en"
            data={data}
            table={table}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex text-stone-500"
              >
                <Eye className="h-4 w-4" />
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "select"
                        ? "Seleção"
                        : column.id === "nome"
                        ? "Nome"
                        : column.id === "sobrenome"
                        ? "Sobrenome"
                        : column.id === "email"
                        ? "Email"
                        : column.id === "bitcoin"
                        ? "Bitcoin"
                        : column.id === "fiat"
                        ? "Fiat"
                        : column.id === "actions"
                        ? "Ações"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
