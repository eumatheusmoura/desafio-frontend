"use client";

import { useTheme, useSystemTheme } from "./index";

export function ThemeDebug() {
  const { theme, resolvedTheme, isLoading } = useTheme();
  const systemTheme = useSystemTheme();

  return (
    <div className="fixed bottom-4 right-4 bg-background border border-border rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-semibold mb-2">Debug do Tema</h3>
      <div className="space-y-1 text-sm">
        <div>
          Tema selecionado: <span className="font-mono">{theme}</span>
        </div>
        <div>
          Tema resolvido: <span className="font-mono">{resolvedTheme}</span>
        </div>
        <div>
          Tema do sistema: <span className="font-mono">{systemTheme}</span>
        </div>
        <div>
          Carregando:{" "}
          <span className="font-mono">{isLoading ? "Sim" : "Não"}</span>
        </div>
        <div>
          Classe dark:{" "}
          <span className="font-mono">
            {typeof document !== "undefined"
              ? document.documentElement.classList.contains("dark")
                ? "Sim"
                : "Não"
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
