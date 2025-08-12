# TexConnect Backend

Backend NestJS para a plataforma TexConnect.

## Como rodar

1. Configure as variáveis no `.env` ou use `docker-compose.yml` para PostgreSQL e variáveis.

2. Instale dependências:
```bash
npm install


Endpoints principais
POST /auth/register - Registrar usuário

POST /auth/login - Login (JWT)

GET /users/me - Perfil

CRUD /demands

CRUD /matches

CRUD /messages

POST /matching/auto-match/:demandId - Matching automático