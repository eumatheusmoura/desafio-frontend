# Dockerfile para aplicação Next.js
FROM node:18-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Dependências de produção
FROM base AS deps
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml* ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Build da aplicação
FROM base AS builder
WORKDIR /app

# Definir variáveis de ambiente para o build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules

# Copiar arquivo de ambiente primeiro
COPY .env.local ./

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm build

# Produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para executar a aplicação
CMD ["node", "server.js"]
