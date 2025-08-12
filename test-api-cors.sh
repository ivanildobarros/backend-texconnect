#!/bin/bash

echo "🧪 Testando API do TexConnect..."
echo "================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base da API
BASE_URL="http://localhost:3001"

echo -e "${YELLOW}1. Testando se a API está online...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/auth/test")
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ API está online (Status: $response)${NC}"
else
    echo -e "${RED}❌ API não está respondendo (Status: $response)${NC}"
    exit 1
fi

echo -e "\n${YELLOW}2. Testando endpoint de teste...${NC}"
curl -s -X GET "$BASE_URL/auth/test" | jq '.' || echo "Resposta não é JSON válido"

echo -e "\n${YELLOW}3. Testando CORS com OPTIONS...${NC}"
curl -s -X OPTIONS "$BASE_URL/auth/login" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

echo -e "\n${YELLOW}4. Testando login com dados de teste...${NC}"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"test@example.com","password":"123456"}' | jq '.' || echo "Resposta não é JSON válido"

echo -e "\n${GREEN}🎉 Teste concluído!${NC}"