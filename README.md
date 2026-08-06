# Portal de Currículos

Aplicação web (Next.js) para gerenciamento de currículos: login/cadastro de usuários e CRUD dos dados pessoais do currículo (experiências, cursos e diplomas estão previstos na navegação, mas ainda não implementados).

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- TypeScript
- Tailwind CSS 4 (`@tailwindcss/postcss`) + CSS Modules por página/componente
- Jest + Testing Library (`@testing-library/react`, `jest-environment-jsdom`) para testes
- ESLint (`eslint-config-next`)

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A tela inicial (`/`) é a página de login.

Outros scripts disponíveis:

```bash
npm run build       # build de produção
npm run start        # sobe o build de produção
npm run lint          # ESLint
npm run test           # roda a suíte de testes (Jest)
npm run test:watch      # Jest em modo watch
```

## Backend / API

Este projeto é apenas o front-end. As chamadas para `/api/*` são reescritas (proxy) em [next.config.ts](next.config.ts) para uma API externa:

```
/api/:path*  →  https://go-api-nzg1.onrender.com/:path*
```

## Estrutura de pastas

```
src/
├── app/                    # Rotas (App Router)
│   ├── page.tsx             # "/"        – Login
│   ├── login/page.tsx        # "/login"   – Cadastro de novo usuário
│   ├── home/page.tsx          # "/home"    – Dashboard pós-login
│   ├── personal/page.tsx       # "/personal"        – Menu de Dados Pessoais
│   ├── personal/create/         # "/personal/create" – Adicionar
│   ├── personal/search/          # "/personal/search" – Buscar
│   ├── personal/update/           # "/personal/update" – Atualizar
│   ├── personal/delete/            # "/personal/delete" – Excluir
│   └── layout.tsx                   # Layout raiz (metadata, fontes, html/body)
├── components/               # Componentes de UI compartilhados (ex.: Header)
├── hooks/                     # Hooks de navegação e autenticação
├── services/                   # Chamadas fetch às rotas /api/*
├── shared/                      # Constantes compartilhadas (labels de campos etc.)
└── types/                        # Tipos TypeScript (Login, AuthSession, Personal)
```

> Cada rota possui, ao lado do `page.tsx`, um `page.module.css` (estilos) e um `page.test.tsx` (testes).

## Rotas

| Rota | Página | Descrição |
| --- | --- | --- |
| `/` | Login | Formulário de e-mail/senha; redireciona para `/home?loginId=<id>` |
| `/login` | Cadastro | Criação de novo usuário (nome da rota é legado; o conteúdo é o formulário de cadastro) |
| `/home` | Home | Dashboard com atalhos para Dados Pessoais, Experiências, Cursos e Diplomas |
| `/personal` | Menu de Dados Pessoais | Atalhos para adicionar, atualizar, buscar e excluir |
| `/personal/create` | Adicionar | Formulário de criação dos dados pessoais |
| `/personal/search` | Buscar | Consulta dos dados pessoais |
| `/personal/update` | Atualizar | Edição dos dados pessoais |
| `/personal/delete` | Excluir | Remoção dos dados pessoais |

Rotas protegidas (tudo exceto `/` e `/login`) usam o hook `useRequireAuth`, que redireciona para `/` quando não há sessão ativa.

## Autenticação

Não há autenticação real no back-end: o login (`src/services/loginService.ts`) busca todos os cadastros em `/api/logins` e valida e-mail/senha no cliente. Após o login, a sessão (`{ id, email }`) é salva em `sessionStorage` via `src/services/authService.ts` e lida pelo hook `useRequireAuth` para proteger as demais páginas. `useAppNavigation` centraliza as rotas de navegação entre as telas e o logout.

## Testes

```bash
npm run test
```

Os testes usam Jest (via `next/jest`) com ambiente `jsdom` e Testing Library. Cada página/componente/hook/serviço tem seu arquivo `*.test.tsx`/`*.test.ts` correspondente.

## Observação

Existe um arquivo `page.tsx` solto na raiz do repositório (fora de `src/app`), não utilizado pelo App Router — remanescente de uma versão anterior da Home.
