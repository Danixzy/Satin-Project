# Tarefa 2 — Backend completo (API REST)

## Contexto necessário desta task

Contrato de API completo (de `plan.md`, seção 4):

| Método | Rota | Body | Resposta |
|---|---|---|---|
| `GET` | `/api/cartas` | — | `200` array de Carta |
| `GET` | `/api/cartas/:id` | — | `200` Carta / `404` |
| `POST` | `/api/cartas` | `{nome, numero, colecao, imagem_url?}` | `201` Carta |
| `PUT` | `/api/cartas/:id` | `{nome, numero, colecao, imagem_url?}` | `200` Carta / `404` |
| `DELETE` | `/api/cartas/:id` | — | `204` / `404` |

Entidade Carta (de `spec.md`, seção 4): `id, nome, numero, colecao, imagem_url, created_at`. `nome`, `numero` e `colecao` são obrigatórios; `imagem_url` é opcional.

CORS (de `plan.md`, seção 4): backend e frontend são apps/origens diferentes (dois domínios em produção, mesmo estando no mesmo repositório) — o backend precisa habilitar `cors()` sem restrição de origem (sem autenticação/cookies envolvidos, não precisa lista de origens).

`apps/backend/init.sql`, `package.json` e `.env.example` já existem (Tarefa 1). Connection string vem de `process.env.DATABASE_URL`, porta de `process.env.PORT`.

## O que fazer

1. Criar `apps/backend/src/db.js`: pool de conexão `pg.Pool` a partir de `DATABASE_URL`.
2. Criar `apps/backend/src/routes/cartas.js` com os 5 endpoints do contrato acima, nesta ordem: `GET /api/cartas` (listar, ordenado por `created_at desc`) primeiro — ele é o exemplo de estrutura e tratamento de erro que os outros 4 devem seguir (mesmo padrão, sem variar estilo entre eles); depois `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`.
3. Criar `apps/backend/src/server.js`: app Express **só de API** (não serve frontend — são repos/deploys separados), com `cors()` + `express.json()`, monta as rotas em `/api/cartas`, escuta em `process.env.PORT`.

## Arquivos esperados

- `apps/backend/src/db.js`
- `apps/backend/src/routes/cartas.js`
- `apps/backend/src/server.js`

## Como usar este arquivo

1. Cole o conteúdo deste arquivo no chat como contexto/task.
2. Cole em seguida o system prompt de `SDD/system-prompt.md` (ou confirme que o `CLAUDE.md` da raiz já está carregado na sessão).
3. Rode. Revise o resultado antes de seguir pra próxima tarefa.

## Depois de rodar

1. Marcar a Tarefa 2 como concluída em `SDD/tasks.md`.
2. Registrar tokens de entrada/saída e custo na linha 2 de `SDD/log-chamadas.md`.
3. Print da chamada — guardar também como referência do exemplo few-shot (o primeiro endpoint implementado).
