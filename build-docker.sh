#!/bin/bash

echo "🚀 Iniciando build e execução da aplicação no Docker..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se o arquivo .env.local existe
if [ ! -f "frontend/.env.local" ]; then
    echo "❌ Arquivo frontend/.env.local não encontrado!"
    echo "📋 Crie o arquivo com as seguintes variáveis:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_do_supabase"
    echo ""
    echo "💡 Você pode copiar do arquivo env.example:"
    echo "   cp frontend/env.example frontend/.env.local"
    echo "   # Depois edite o arquivo com suas credenciais reais"
    exit 1
fi

echo "✅ Arquivo .env.local encontrado"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker compose down

# Remover imagens antigas (opcional)
read -p "Deseja remover imagens antigas? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removendo imagens antigas..."
    docker compose down --rmi all
fi

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
docker compose build --no-cache

# Executar a aplicação
echo "▶️ Iniciando a aplicação..."
docker compose up -d

# Aguardar a aplicação inicializar
echo "⏳ Aguardando a aplicação inicializar..."
sleep 10

# Verificar status
echo "📊 Status dos containers:"
docker compose ps

echo ""
echo "✅ Aplicação iniciada com sucesso!"
echo "🌐 Acesse: http://localhost:3000"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker compose logs -f frontend"
echo "  - Parar: docker compose down"
echo "  - Rebuild: docker compose build --no-cache"
echo "  - Modo desenvolvimento: docker compose --profile dev up -d"
