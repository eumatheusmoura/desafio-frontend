import { LucideIcon } from "lucide-react";

export interface NavigationLink {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface UserMenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
  separator?: boolean;
}
