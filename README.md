# Frontend da prova — tarefas

Este diretório é a raiz de um repositório independente. React + Vite + Auth0. Copie `.env.example` para `.env`, preencha os três identificadores públicos Auth0, execute `npm ci` e `npm run dev`. Acesse http://localhost:5173.

O navegador sempre chama `/api/tarefa`. Localmente, Vite encaminha ao backend em 127.0.0.1:8080; na Vercel, o `vercel.json` encaminha ao backend AWS.

Antes de publicar, execute `node scripts/configurar-proxy.mjs URL_PUBLICA_DO_BACKEND`. Exemplo com proxy público da EC2: `node scripts/configurar-proxy.mjs http://3.236.36.11`. Isso grava a origem no vercel.json; faça commit/push depois. Não existe VITE_API_URL nesta versão: as chamadas são relativas para passar pelo proxy.

Na Vercel: root padrão deste repositório, framework Vite, build npm run build, saída dist, Node 22. Configure VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID e VITE_AUTH0_AUDIENCE. Adicione a URL final aos três campos de URLs Auth0 e faça novo deploy se mudar as variáveis.

## Publicação realizada

Aplicação: https://prova-tarefas-vanessaricoy.vercel.app

Publicada via Vercel CLI, com as três variáveis de produção configuradas no projeto. No Auth0, a URL acima deve estar em Allowed Callback URLs, Allowed Logout URLs e Allowed Web Origins da SPA. A SPA precisa ter User-Delegated Access na API de Identifier https://api.tarefas.

A integração automática GitHub/Vercel depende de conectar o repositório no painel. Para republicar manualmente, após instalar/autenticar o Vercel CLI, use `vercel deploy --project prova-tarefas-vanessaricoy --prod --yes` na raiz deste repositório.
