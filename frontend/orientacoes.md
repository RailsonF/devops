# 🎨 Orientações de Desenvolvimento - Frontend

## 🎯 Objetivo
Desenvolver uma interface responsiva e intuitiva em **React (Vite)** para consumo da  API (Hono) e da Fake Store API. O frontend será publicado no **Cloudflare Pages**.

## ✅ Lista de Tarefas (To-Do)

### 1. Interface de Clientes
- [ ] Criar tela/modal para cadastrar novos clientes (Nome e E-mail).
- [ ] Criar listagem de clientes cadastrados (com opções de editar e excluir).
- [ ] Tratar erros da API (ex: mostrar aviso de "E-mail já cadastrado").

### 2. Interface de Produtos e Favoritos
- [ ] Criar tela que consome e exibe os produtos da `https://fakestoreapi.com/products`.
- [ ] Adicionar botão de "Favoritar" nos produtos (vinculando ao cliente selecionado).
- [ ] Criar tela do perfil do Cliente para listar os produtos que ele favoritou.
- [ ] Permitir a remoção de um favorito na tela de listagem.

### 3. Requisitos Extras
- [ ] Adicionar o nome da equipe no rodapé (footer) da página.
- [ ] Garantir que todas as chamadas HTTP apontem para a URL correta do nosso backend.

## 🌿 Regras de Branch e Commits
- Nunca commite direto na `main`.
- Para criar uma nova funcionalidade no frontend, crie a branch com o prefixo `frontend/feature/`:
  - *Exemplo:* `git checkout -b frontend/feature/tela-produtos`
- Para corrigir um visual/bug:
  - *Exemplo:* `git checkout -b frontend/fix/botao-favoritar`
- Ao terminar a tela, abra um **Pull Request (PR)** detalhando o que foi feito (se possível, com um print da tela) antes de fazer o merge para a `main`.