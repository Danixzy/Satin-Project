# Tasks — Implementação

> Checklist mestre. Cada tarefa tem seu prompt pronto pra colar no chat em `SDD/prompts/`, com contexto já curado (só o trecho de `spec.md`/`plan.md` que aquela tarefa precisa). Cada tarefa = uma chamada de IA = uma linha em `log-chamadas.md`. Segue a ordem — tarefa N depende do que a tarefa N-1 deixou pronto.
>
> Escopo do fluxo de IA: até rodar tudo em localhost. Deploy no CapRover é feito manualmente depois, fora deste checklist (ver `plan.md` seção 6).
>
> Um repositório git só (a raiz do workspace, entregue pro professor): `apps/backend` e `apps/frontend` são subpastas, não repositórios separados (ver `plan.md` seção 2). Cada uma continua deployada como app CapRover independente via CLI.

- [ ] **Tarefa 1 — Setup do projeto** (`SDD/prompts/01-setup.md`): `git init` na raiz, `.gitignore`, scaffold de `apps/backend/` e `apps/frontend/`, `init.sql`.
- [ ] **Tarefa 2 — Backend completo** (`SDD/prompts/02-backend-api.md`): `db.js`, os 5 endpoints REST de `/api/cartas`, `server.js` (com CORS).
- [ ] **Tarefa 3 — Frontend completo** (`SDD/prompts/03-frontend.md`): cliente de API, `CardItem`, `ListaCartas`, `FormularioCarta`, rotas — termina rodando tudo em localhost e validando os critérios de aceite.

Isso é a branch `main` (implementação com contexto completo). Ver `plan.md` seção 2 pra estratégia de branches caso rode a mesma feature de novo (contexto mínimo, ou modelo diferente).

**Ao fechar cada tarefa**, antes de marcar o checkbox:

1. Rode o subagente `revisor-sdd` — ele confere o código gerado contra `spec.md`/`plan.md` e aponta campo, rota ou tela inventados (o risco que o enunciado avisa na seção 2).
2. Rode a skill `custo-sessao` pra extrair tokens/custo daquela tarefa e preencher a linha em `log-chamadas.md`.

## Depois de rodar local (evidências, não é código)

- [ ] Rodar o teste de curadoria de contexto (`SDD/teste-curadoria-contexto.md` — tentativa mínima vs. `main`), capturar prints.
- [ ] Preencher `SDD/log-chamadas.md` com tokens/custo reais das 3 chamadas + as do teste de curadoria, calcular total da sessão.
- [ ] Criar o repositório no GitHub (um só, a raiz do workspace), push, e adicionar **@pedrosatin** como collaborator (`Settings > Collaborators`) — obrigatório mesmo público, senão o trabalho não conta como entregue (`INSTRUCOES-TRABALHO.md` seção 9).
- [ ] Fazer o deploy manual no CapRover — dois apps separados (`backend` e `frontend`, via CLI de dentro de cada subpasta) + Postgres (ver `plan.md` seção 6) — fora do fluxo de tasks de IA.
- [ ] Preencher `README.md` na ordem exigida pela seção 8 de `SDD/docs/INSTRUCOES-TRABALHO.md`, com todos os prints e o link do deploy.
