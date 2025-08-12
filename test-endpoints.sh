#!/bin/bash

echo "=== Testando Endpoints do Backend ==="

# Primeiro, fazer login para obter o token
echo "1. Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "workshop@test.com", "password": "123456"}')

echo "Login Response: $LOGIN_RESPONSE"

# Extrair o token da resposta
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Erro: Não foi possível obter o token de autenticação"
  exit 1
fi

echo "✅ Token obtido: ${TOKEN:0:20}..."

# Testar endpoints
echo ""
echo "2. Testando GET /users..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/users | jq '.' || echo "❌ Erro no endpoint /users"

echo ""
echo "3. Testando GET /demands..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/demands | jq '.' || echo "❌ Erro no endpoint /demands"

echo ""
echo "4. Testando GET /matches..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/matches | jq '.' || echo "❌ Erro no endpoint /matches"

echo ""
echo "=== Teste concluído ==="