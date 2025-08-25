import { User, Mail, Bitcoin, DollarSign, Calendar } from "lucide-react";
import type { ColumnConfig } from "./data-table-filter/core/types";
import type { UsuarioDisplay } from "../types/usuario";

export const filterColumns: ColumnConfig<UsuarioDisplay>[] = [
  {
    id: "nome",
    accessor: (row) => row.nome,
    displayName: "Nome",
    icon: User,
    type: "text",
  },
  {
    id: "sobrenome",
    accessor: (row) => row.sobrenome,
    displayName: "Sobrenome",
    icon: User,
    type: "text",
  },
  {
    id: "email",
    accessor: (row) => row.email,
    displayName: "Email",
    icon: Mail,
    type: "text",
  },
  {
    id: "bitcoin",
    accessor: (row) => row.bitcoin,
    displayName: "Bitcoin",
    icon: Bitcoin,
    type: "text",
  },
  {
    id: "fiat",
    accessor: (row) => row.fiat,
    displayName: "Fiat",
    icon: DollarSign,
    type: "text",
  },
  {
    id: "criado_em",
    accessor: (row) => row.criado_em,
    displayName: "Data de Criação",
    icon: Calendar,
    type: "date",
  },
];
