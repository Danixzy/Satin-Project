# Tarefa 1 — Setup do projeto

## Contexto necessário desta task

Stack (de `plan.md`, seção 1): backend Node.js + Express + `pg` (sem ORM); frontend React + Vite + TypeScript + `react-router-dom`. **Um repositório git só** (a raiz do workspace) — `apps/backend` e `apps/frontend` são subpastas normais, não repositórios separados; o deploy de cada uma continua independente (via CapRover CLI, ver `plan.md` seção 6).

Estrutura de pastas alvo (de `plan.md`, seção 2):

```
apps/
├── backend/
│   ├── src/
│   │   ├── db.js
│   │   ├── routes/cartas.js
│   │   └── server.js
│   ├── init.sql
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/cartas.ts
    │   ├── components/CardItem.tsx
    │   ├── pages/ListaCartas.tsx
    │   ├── pages/FormularioCarta.tsx
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    └── .env.example              # VITE_API_URL=http://localhost:3000
```

Schema do banco (de `plan.md`, seção 3):

```sql
create table if not exists cartas (
  id serial primary key,
  nome text not null,
  numero text not null,
  colecao text not null,
  imagem_url text,
  created_at timestamptz not null default now()
);
```

## O que fazer

1. Rodar `git init` **uma vez, na raiz do workspace** (não dentro de `apps/backend` ou `apps/frontend`). Criar um `.gitignore` na raiz cobrindo `node_modules`, `.env`, `dist` (vale pras duas subpastas).
2. Criar `apps/backend/` e `apps/frontend/` como subpastas dentro de `apps/`.
3. Em `apps/backend/`: criar `package.json` com as dependências `express`, `pg`, `cors`, `dotenv`; criar `init.sql` com exatamente o schema acima; criar `.env.example` com `DATABASE_URL=` e `PORT=3000` de exemplo.
4. Em `apps/frontend/`: criar o projeto a partir do template `react-ts` do Vite, adicionando `react-router-dom`; criar `.env.example` com `VITE_API_URL=http://localhost:3000`.

Só scaffold e estrutura — nenhum código de negócio ainda (isso é a Tarefa 2 e 3).

## Arquivos esperados

- `.gitignore` (raiz)
- `apps/backend/package.json`, `init.sql`, `.env.example`
- `apps/frontend/` (projeto Vite completo, ainda sem as páginas/componentes da feature)

## Como usar este arquivo

1. Cole o conteúdo deste arquivo no chat como contexto/task.
2. Cole em seguida o system prompt de `SDD/system-prompt.md` (ou confirme que o `CLAUDE.md` da raiz já está carregado na sessão).
3. Rode. Revise o resultado antes de seguir pra próxima tarefa.

## Depois de rodar

1. Marcar a Tarefa 1 como concluída em `SDD/tasks.md`.
2. Registrar tokens de entrada/saída e custo na linha 1 de `SDD/log-chamadas.md`.
3. Print da chamada.
