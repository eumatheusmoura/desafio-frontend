#!/bin/bash

echo "🚀 Iniciando modo desenvolvimento com Docker..."

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

# Executar em modo desenvolvimento
echo "▶️ Iniciando modo desenvolvimento..."
docker compose --profile dev up -d

# Aguardar a aplicação inicializar
echo "⏳ Aguardando a aplicação inicializar..."
sleep 5

# Verificar status
echo "📊 Status dos containers:"
docker compose ps

echo ""
echo "✅ Modo desenvolvimento iniciado com sucesso!"
echo "🌐 Acesse: http://localhost:3001"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker compose logs -f frontend-dev"
echo "  - Parar: docker compose --profile dev down"
echo "  - Rebuild: docker compose --profile dev build --no-cache"
echo "  - Executar comando no container: docker compose exec frontend-dev sh"
