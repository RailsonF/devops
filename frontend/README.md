# 💻 Frontend - Gerenciador de Clientes & Favoritos

Esta é a aplicação cliente desenvolvida em **React (JavaScript)** e **Vite**, estilizada com o moderno **Tailwind CSS v4**. Ela faz parte da Atividade Prática de DevOps e está estruturada para ser publicada no **Cloudflare Pages**.

## 🛠️ Tecnologias Utilizadas

*   **React** (Interface Declarativa)
*   **Vite** (Build tool ultra rápida)
*   **Tailwind CSS v4** (Estilização de alta performance sem arquivos de configuração complexos)
*   **Lucide React** (Pacote de ícones limpos e modernos)

## 🚀 Como Executar Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** instalado em sua máquina.

### Passos para Execução

1. Entre na pasta do frontend:
```bash
   cd frontend

    Instale todas as dependências do projeto:

Bash

   npm install

    Inicie o servidor de desenvolvimento local:

Bash

   npm run dev

    Abra o navegador no endereço indicado no terminal (geralmente http://localhost:5173/).

📁 Estrutura do Código Criada

    src/views/Clientes.jsx: Tela de gerenciamento do CRUD de clientes (com dados simulados/mock para testes visuais).

    src/services/api.js: Centralização das chamadas assíncronas de fetch para o Backend Worker e API Externa (Fake Store).

    src/App.jsx: Componente principal que gerencia o layout da aplicação e exibe o rodapé obrigatório da equipe.


---

> 💡 **Nota de DevOps:** O próximo passo da equipe quando você voltar será criar o `Dockerfile` definitivo do front e integrá-lo no `docker-compose.yml` da raiz, deixando a aplicação pronta para o pipeline de build automatizado!