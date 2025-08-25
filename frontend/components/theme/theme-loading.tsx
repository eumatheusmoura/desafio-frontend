"use client";

import { useTheme } from "./theme-provider";

interface ThemeLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ThemeLoading({ children, fallback = null }: ThemeLoadingProps) {
  const { isLoading } = useTheme();

  if (isLoading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
