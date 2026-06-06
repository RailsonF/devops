
# 🚀 DevOps - Loja DevOps

Projeto desenvolvido pela **Equipe Railson e Michely** para a Atividade Prática de DevOps.

## 🏗️ Estrutura

```
/backend   → API REST (Cloudflare Workers + Hono + D1)
/frontend  → Aplicação React + Vite + Tailwind
```

## 🐳 Executar com Docker

```bash
docker compose up --build
```

- Backend: http://localhost:8787
- Frontend: http://localhost:5173

## ▶️ Executar localmente (sem Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## ☁️ Deploy

- **Backend:** CI/CD via GitHub Actions (push na `main` com alterações em `backend/`)
- **Frontend:** Cloudflare Pages (conectado ao repositório)

## 🗄️ Banco de Dados

A aplicação utiliza **Cloudflare D1** (SQLite). Para migrar o schema:

```bash
cd backend
npx wrangler d1 execute db-api-favoritos --command="$(cat schema.sql)"
npx wrangler d1 execute db-api-favoritos --remote --command="$(cat schema.sql)"
```
