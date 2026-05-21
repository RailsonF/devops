# ⚙️ Orientações de Desenvolvimento - Backend

## 🎯 Objetivo
Desenvolver uma API REST escalável utilizando **Hono** para ser publicada no **Cloudflare Workers**. O banco de dados será o **Cloudflare D1**.

## ✅ Lista de Tarefas (To-Do)

### 1. Gestão de Clientes
- [ ] Criar endpoint POST `/clientes` (Cadastrar: Nome, E-mail).
- [ ] Criar regra: Bloquear e-mail duplicado no banco.
- [ ] Criar endpoint GET `/clientes` (Listar todos).
- [ ] Criar endpoint PUT/PATCH `/clientes/:id` (Editar).
- [ ] Criar endpoint DELETE `/clientes/:id` (Remover).

### 2. Gestão de Favoritos e API Externa
- [ ] Criar endpoint POST `/favoritos` (Recebe ID do cliente e ID do produto da Fake Store).
- [ ] Criar regra: Validar se o produto existe na [Fake Store API](https://fakestoreapi.com/) antes de salvar.
- [ ] Criar regra: Não permitir que o cliente favorite o mesmo produto duas vezes.
- [ ] Criar endpoint GET `/favoritos/:clienteId` (Listar favoritos).
  - *Atenção:* Este endpoint deve retornar os dados completos do produto (id, título, imagem, preço, avaliação).
- [ ] Criar endpoint DELETE `/favoritos/:id` (Remover favorito).

## 🌿 Regras de Branch e Commits
- Nunca commite direto na `main`.
- Para criar uma nova funcionalidade no backend, crie a branch a partir da `main` com o prefixo `backend/feature/`:
  - *Exemplo:* `git checkout -b backend/feature/crud-clientes`
- Para corrigir um bug:
  - *Exemplo:* `git checkout -b backend/fix/erro-email-duplicado`
- Ao terminar a tarefa, abra um **Pull Request (PR)** para a `main`.