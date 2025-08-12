#!/bin/bash

echo "=== Testando API TexConnect ==="
echo ""

# URL base da API
BASE_URL="http://localhost:3001"

echo "1. Testando endpoint de teste..."
curl -X GET "$BASE_URL/auth/test" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "2. Testando login com usuário de teste..."
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "oficina@teste.com",
    "password": "123456"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "3. Testando login com usuário empresa..."
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "empresa@teste.com",
    "password": "123456"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "=== Fim dos testes ==="