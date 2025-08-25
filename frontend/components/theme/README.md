# Sistema de Tema - Desafio Frontend

## Visão Geral

Este sistema de tema resolve o problema do **Flash of Unstyled Content (FOUC)** que ocorre quando o usuário faz refresh na página e o tema fica claro temporariamente antes de voltar ao tema escuro.

## Componentes

### ThemeProvider

O componente principal que gerencia o estado do tema e previne o flash.

**Props:**

- `children`: Componentes filhos
- `defaultTheme`: Tema padrão ("light", "dark", "system")
- `storageKey`: Chave para armazenar no localStorage

**Hook:**

```tsx
const { theme, setTheme, resolvedTheme, isLoading } = useTheme();
```

### ThemeToggle

Componente para alternar entre temas claro e escuro.

### ThemeLoading

Componente que pode ser usado para mostrar um estado de loading durante a hidratação.

### ThemeDebug

Componente para debug que mostra informações sobre o estado atual do tema.

## Como Funciona

### 1. Prevenção do Flash

- Script inline no `<head>` define o tema antes da hidratação
- Usa `localStorage` para persistir a preferência do usuário
- Aplica a classe `dark` ao `documentElement` imediatamente

### 2. Estado de Loading

- `isLoading` indica quando o tema ainda está sendo inicializado
- Evita mudanças visuais durante a hidratação

### 3. Sincronização com Sistema

- Detecta mudanças no tema do sistema operacional
- Atualiza automaticamente quando o usuário muda o tema do sistema

## Uso

### Configuração Básica

```tsx
import { ThemeProvider } from "@/components/theme";

export default function Layout({ children }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="meu-app-theme">
      {children}
    </ThemeProvider>
  );
}
```

### Hook useTheme

```tsx
import { useTheme } from "@/components/theme";

function MeuComponente() {
  const { theme, setTheme, resolvedTheme, isLoading } = useTheme();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return <button onClick={() => setTheme("dark")}>Tema Escuro</button>;
}
```

### Hook useSystemTheme

```tsx
import { useSystemTheme } from "@/components/theme";

function MeuComponente() {
  const systemTheme = useSystemTheme();

  return <div>Tema do sistema: {systemTheme}</div>;
}
```

## Configuração

### Variáveis CSS

O sistema usa variáveis CSS personalizadas definidas em `globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.147 0.004 49.25);
  /* ... outras variáveis */
}

.dark {
  --background: oklch(0.147 0.004 49.25);
  --foreground: oklch(0.985 0.001 106.423);
  /* ... outras variáveis */
}
```

### Tailwind CSS

O sistema é compatível com Tailwind CSS usando a classe `dark:`:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Conteúdo
</div>
```

## Solução do Problema Original

O problema do flash foi resolvido através de:

1. **Script Inline**: Executa antes da hidratação do React
2. **Estado de Loading**: Evita mudanças visuais durante a inicialização
3. **Aplicação Imediata**: Tema é aplicado ao DOM antes do React renderizar
4. **Persistência**: Usa localStorage para manter a preferência do usuário

## Debug

Para debug, use o componente `ThemeDebug`:

```tsx
import { ThemeDebug } from "@/components/theme";

function App() {
  return (
    <div>
      {/* Seu app */}
      <ThemeDebug />
    </div>
  );
}
```

## Considerações de Performance

- Script inline é executado apenas uma vez
- Estado de loading previne re-renders desnecessários
- Media queries são otimizadas para mudanças do sistema
- localStorage é acessado apenas quando necessário
