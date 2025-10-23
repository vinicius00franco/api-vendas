#!/bin/bash

# Script para iniciar a API de vendas em desenvolvimento
# Autor: GitHub Copilot
# Data: 23 de outubro de 2025

set -e  # Para o script em caso de erro

# Muda para o diretório raiz do projeto
cd "$(dirname "$0")/.."

echo "🚀 Iniciando API de Vendas..."

# Verifica se Docker está instalado e disponível
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detectado. Usando Docker Compose..."

    # Verifica se .env existe
    if [ ! -f .env ]; then
        echo "⚠️  Arquivo .env não encontrado. Criando exemplo..."
        cat > .env << EOF
# Configurações da API
NODE_ENV=development
PORT=3000

# Banco de dados
DB_HOST=postgres
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=api_vendas

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=1d

# Outras configurações (se necessário)
EOF
        echo "✅ Arquivo .env criado. Edite-o com suas configurações antes de continuar."
        echo "⏹️  Saindo para que você configure o .env."
        exit 1
    fi

    # Sobe os containers
    echo "📦 Subindo containers com Docker Compose..."
    docker-compose up -d

    # Espera o banco estar pronto
    echo "⏳ Aguardando PostgreSQL iniciar..."
    sleep 10

    # Executa migrations dentro do container da API
    echo "🗃️  Executando migrations..."
    docker-compose exec -T api npm run migration:run

    echo "✅ API iniciada com sucesso!"
    echo "🌐 API disponível em: http://localhost:3001"
    echo "🐘 PostgreSQL em: localhost:5435"
    echo "🛠️  pgAdmin em: http://localhost:8081 (admin@example.com / admin)"
    echo ""
    echo "Para parar: docker-compose down"
    echo "Para logs: docker-compose logs -f"

else
    echo "🐧 Docker não detectado. Usando npm (modo local)..."

    # Verifica se Node.js está instalado
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
        exit 1
    fi

    # Verifica se .env existe
    if [ ! -f .env ]; then
        echo "⚠️  Arquivo .env não encontrado. Criando exemplo..."
        cat > .env << EOF
# Configurações da API
NODE_ENV=development
PORT=3000

# Banco de dados (configure para seu PostgreSQL local)
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=api_vendas

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=1d
EOF
        echo "✅ Arquivo .env criado. Configure o banco de dados e execute novamente."
        exit 1
    fi

    # Instala dependências se node_modules não existir
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências..."
        npm install
    fi

    # Executa migrations
    echo "🗃️  Executando migrations..."
    npm run migration:run

    # Inicia a API
    echo "🚀 Iniciando API em modo desenvolvimento..."
    npm run dev
fi