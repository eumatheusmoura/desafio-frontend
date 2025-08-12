"use client";

import { BoltIcon, BookOpenIcon, LogOutIcon, UserPenIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserProfile, UserMenuItem } from "@/types/navigation";

interface UserMenuProps {
  user?: UserProfile;
}

const defaultUser: UserProfile = {
  name: "Matheus Moura",
  email: "matheus.moura@exemplo.com",
  avatar: "/user.jpeg",
  initials: "MM",
};

const userMenuItems: UserMenuItem[] = [
  { label: "Configurações", icon: BoltIcon, href: "/configuracoes" },
  { label: "Documentação", icon: BookOpenIcon, href: "/documentacao" },
  { separator: true, label: "", icon: BoltIcon },
  { label: "Editar Perfil", icon: UserPenIcon, href: "/perfil" },
  { separator: true, label: "", icon: BoltIcon },
  {
    label: "Sair",
    icon: LogOutIcon,
    variant: "destructive",
    onClick: () => console.log("Logout"),
  },
];

export default function UserMenu({ user = defaultUser }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-auto p-0 hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <span className="border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
            <span className="sr-only">Online</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userMenuItems.map((item, index) => {
          if (item.separator) {
            return <DropdownMenuSeparator key={index} />;
          }

          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={index}
              variant={item.variant}
              onClick={item.onClick}
            >
              <Icon size={16} className="opacity-60" aria-hidden="true" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
