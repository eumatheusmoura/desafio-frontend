# 🐳 Docker para Aplicação Frontend

Este projeto inclui configurações Docker para facilitar o desenvolvimento e deploy da aplicação.

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose (incluído no Docker Desktop)
- Git

## 🚀 Início Rápido

### 1. Build e Execução Automática

```bash
# Execute o script automatizado
./build-docker.sh
```

### 2. Build e Execução Manual

#### Produção

```bash
# Build da aplicação
docker compose build

# Executar
docker compose up -d

# Ver logs
docker compose logs -f frontend

# Parar
docker compose down
```

#### Desenvolvimento (com hot reload)

```bash
# Executar em modo desenvolvimento
docker compose --profile dev up -d

# Ver logs
docker compose logs -f frontend-dev

# Parar
docker compose --profile dev down
```

## 🏗️ Estrutura dos Arquivos

```
desafio-frontend/
├── docker-compose.yml          # Configuração principal do Docker Compose
├── build-docker.sh             # Script automatizado de build
├── frontend/
│   ├── Dockerfile              # Dockerfile para produção
│   ├── Dockerfile.dev          # Dockerfile para desenvolvimento
│   ├── .dockerignore           # Arquivos ignorados no build
│   └── next.config.ts          # Configuração Next.js otimizada
└── README-Docker.md            # Este arquivo
```

## 🔧 Configurações

### Dockerfile (Produção)

- Multi-stage build para otimização
- Usuário não-root para segurança
- Build standalone do Next.js
- Otimizado para produção

### Dockerfile.dev (Desenvolvimento)

- Hot reload habilitado
- Volumes montados para desenvolvimento
- Dependências instaladas localmente

### Docker Compose

- **Porta 3000**: Aplicação de produção
- **Porta 3001**: Aplicação de desenvolvimento (quando usando profile dev)
- Rede isolada para a aplicação
- Restart automático configurado

## 📊 Comandos Úteis

### Gerenciamento de Containers

```bash
# Ver status
docker compose ps

# Ver logs em tempo real
docker compose logs -f frontend

# Executar comando dentro do container
docker compose exec frontend sh

# Rebuild sem cache
docker compose build --no-cache
```

### Desenvolvimento

```bash
# Iniciar modo desenvolvimento
docker compose --profile dev up -d

# Ver logs do desenvolvimento
docker compose logs -f frontend-dev

# Parar modo desenvolvimento
docker compose --profile dev down
```

### Limpeza

```bash
# Parar e remover containers
docker compose down

# Parar, remover containers e imagens
docker compose down --rmi all

# Limpar volumes (cuidado!)
docker compose down -v
```

## 🌐 Acessos

- **Produção**: http://localhost:3000
- **Desenvolvimento**: http://localhost:3001

## ⚠️ Notas Importantes

1. **Variáveis de Ambiente**: Certifique-se de configurar as variáveis necessárias (Supabase, etc.)
2. **Portas**: Verifique se as portas 3000 e 3001 não estão sendo usadas por outras aplicações
3. **Build**: O primeiro build pode demorar devido ao download das dependências
4. **Hot Reload**: O modo desenvolvimento inclui hot reload para melhor experiência de desenvolvimento

## 🐛 Troubleshooting

### Problema: Porta já em uso

```bash
# Verificar portas em uso
lsof -i :3000
lsof -i :3001

# Parar processo usando a porta
kill -9 <PID>
```

### Problema: Build falha

```bash
# Limpar cache do Docker
docker system prune -a

# Rebuild sem cache
docker-compose build --no-cache
```

### Problema: Aplicação não inicia

```bash
# Ver logs detalhados
docker-compose logs frontend

# Verificar status do container
docker-compose ps
```

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Multi-stage Docker Builds](https://docs.docker.com/develop/dev-best-practices/multistage-build/)

## 🤝 Contribuição

Para contribuir com melhorias na configuração Docker:

1. Teste as mudanças localmente
2. Atualize a documentação
3. Crie um pull request com descrição detalhada das mudanças
