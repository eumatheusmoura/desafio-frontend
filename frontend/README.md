# Desafio Frontend - Dashboard Moderno

Uma aplicação frontend moderna desenvolvida com Next.js 15, TypeScript e Tailwind CSS, seguindo as melhores práticas de Clean Code e UX Design. Inclui uma DataTable completa para gerenciamento de usuários com funcionalidades avançadas.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI reutilizáveis
- **DiceUI DataTable** - Tabela avançada com filtros e sorting
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schema
- **nuqs** - Gerenciamento de estado de query parameters
- **Lucide React** - Ícones SVG
- **date-fns** - Manipulação de datas
- **pnpm** - Gerenciador de pacotes

## 📁 Estrutura do Projeto

```
frontend/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout raiz com ThemeProvider e NuqsAdapter
│   ├── page.tsx           # Página home com DataTable
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── data-table/       # Componentes da DataTable (DiceUI)
│   ├── layout/           # Componentes de layout
│   ├── navbar-components/ # Componentes da navbar
│   ├── theme/            # Sistema de temas (dark/light)
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── usuarios/         # Componentes específicos de usuários
│   │   ├── usuarios-table.tsx # DataTable principal
│   │   └── usuario-form.tsx   # Formulário com validação
│   └── navigation-header.tsx  # Header principal da aplicação
├── types/                # Definições de tipos TypeScript
│   ├── navigation.ts     # Tipos para navegação
│   └── usuario.ts        # Schema e tipos para usuários
├── lib/                  # Utilitários e dados
│   ├── utils.ts          # Funções utilitárias
│   └── mock-data.ts      # Dados mockados do Supabase
└── hooks/                # React hooks personalizados
    └── use-data-table.ts # Hook para DataTable
```

## 🎯 Recursos Implementados

### ✅ Legibilidade do Código

- **Clean Code**: Funções pequenas, nomes descritivos, responsabilidade única
- **TypeScript**: Tipagem forte com interfaces bem definidas
- **Comentários**: Documentação clara nos componentes principais
- **Consistência**: Padrões de nomenclatura e estrutura uniformes

### ✅ Modularização

- **Componentes Atômicos**: Cada componente tem uma responsabilidade específica
- **Separação de Responsabilidades**: Layout, UI e lógica de negócio separados
- **Reutilização**: Componentes parametrizáveis e extensíveis
- **Estrutura Hierárquica**: Organização clara de pastas e arquivos

### ✅ Experiência do Usuário (UX)

- **Design Responsivo**: Adaptável a todos os tamanhos de tela
- **Acessibilidade**: Aria-labels, navegação por teclado, contraste adequado
- **Performance**: Carregamento otimizado com Next.js
- **Interatividade**: Animações suaves e feedback visual

### ✅ Navbar Moderna

- **Responsiva**: Menu hambúrguer em mobile, layout horizontal em desktop
- **Acessível**: Navegação por teclado e leitores de tela
- **Interativa**: Menu de usuário com dropdown
- **Customizável**: Props tipadas para personalização

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm

### Passos para execução

1. **Instalar dependências**

   ```bash
   pnpm install
   ```

2. **Executar em modo desenvolvimento**

```bash
pnpm dev
```

3. **Acessar a aplicação**
   ```
   http://localhost:3000
   ```

### Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm start` - Inicia servidor de produção
- `pnpm lint` - Executa verificação de linting

## 🏗️ Arquitetura e Padrões

### Princípios Aplicados

1. **Single Responsibility Principle (SRP)**

   - Cada componente tem uma única responsabilidade
   - Separação clara entre apresentação e lógica

2. **Open/Closed Principle (OCP)**

   - Componentes extensíveis via props
   - Interfaces bem definidas para futuras extensões

3. **Interface Segregation Principle (ISP)**

   - Interfaces específicas e enxutas
   - Props opcionais para flexibilidade

4. **Dependency Inversion Principle (DIP)**
   - Dependências abstraídas em interfaces
   - Inversão de controle via props

### Padrões de Design

- **Composition Pattern**: Componentes compostos de outros componentes
- **Provider Pattern**: Contexto global quando necessário
- **Custom Hooks**: Lógica reutilizável extraída
- **Atomic Design**: Hierarquia de componentes (atoms → molecules → organisms)

## 🎨 Customização

### Temas

O projeto utiliza CSS Variables para customização de cores:

- Definidas em `globals.css`
- Compatível com modo escuro/claro
- Facilmente extensível

### Componentes

Todos os componentes são altamente customizáveis via props:

- `className` para estilos personalizados
- `variant` para variações pré-definidas
- Props específicas para comportamento

## 📈 Performance

- **Bundle Otimizado**: Tree-shaking automático
- **Code Splitting**: Carregamento sob demanda
- **Imagens Otimizadas**: Next.js Image component
- **CSS Purging**: Tailwind remove estilos não utilizados

## 🔧 Próximos Passos

Para implementação das APIs mencionadas no desafio:

1. **Setup de API Routes**

   ```typescript
   // app/api/example/route.ts
   export async function GET() {
     // Implementar lógica da API
   }
   ```

2. **Integração com Backend**

   - Configurar cliente HTTP (fetch/axios)
   - Implementar error handling
   - Adicionar loading states

3. **Gerenciamento de Estado**
   - React Query para cache de dados
   - Zustand para estado global
   - Form handling com react-hook-form

## 📞 Suporte

Este projeto foi desenvolvido seguindo as melhores práticas de:

- **Clean Code** (Robert C. Martin)
- **Atomic Design** (Brad Frost)
- **React Best Practices**
- **TypeScript Guidelines**
- **Accessibility Standards (WCAG)**

Para dúvidas ou sugestões, consulte a documentação dos frameworks utilizados.
