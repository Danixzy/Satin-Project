# Plan — Arquitetura Técnica

> Como a spec (`spec.md`) vira código. Estrutura, contrato de API, schema de banco e deploy. Isso também é fonte de verdade — a IA não deve inventar rota, tabela ou pasta fora daqui.

## 1. Stack

- **Frontend**: React + Vite + TypeScript. Roteamento com `react-router-dom`.
- **Backend**: Node.js + Express. Cliente de banco: `pg` (sem ORM — 4 queries não justificam um ORM).
- **Banco**: PostgreSQL, uma tabela só (`cartas`).
- **Deploy**: CapRover (self-hosted, já em configuração pelo grupo). **Um repositório git só** (o próprio `satin_workspace`, entregue pro professor) — `apps/backend` e `apps/frontend` são subpastas desse repo, não repositórios separados. Ainda assim são deployadas como **dois apps CapRover independentes**: cada subpasta tem seu próprio `Dockerfile` + `captain-definition`, e o deploy é feito via CapRover CLI (`caprover deploy`) rodado de dentro de cada subpasta — o CLI empacota só aquele diretório, então não precisa de repositório git próprio nem de integração automática com GitHub por app.

Escolha deliberada: nada de autenticação, ORM, camada de service/repository ou testes — é um CRUD de 4 operações sobre 1 tabela, qualquer coisa além disso é complexidade que a feature não pede (ver `spec.md` seção 3).

## 2. Estrutura de pastas

Um repositório git só, na raiz do workspace. `apps/backend` e `apps/frontend` são subpastas normais dentro dele — sem `.git` próprio.

```
satin_workspace/                        # repositório git único, entregue no GitHub
├── SDD/                                # documentação (spec, plan, tasks, system-prompt)
│   ├── docs/                           # INSTRUCOES-TRABALHO.md, user-stories.md (input do trabalho)
│   ├── prompts/                        # um prompt pronto por tarefa (contexto já curado)
│   └── template/                       # modelo pra criar novos prompts de tarefa
├── README.md                           # entrega final (evidências, links, tabela de custos)
├── CLAUDE.md                           # system prompt ativo pra esta sessão de implementação
└── apps/
    ├── backend/
    │   ├── src/
    │   │   ├── db.js                   # pool de conexão pg (lê DATABASE_URL do ambiente)
    │   │   ├── routes/cartas.js        # os 5 endpoints de /api/cartas
    │   │   └── server.js               # express app: só API, sem servir frontend
    │   ├── init.sql                    # schema da tabela cartas
    │   ├── package.json
    │   ├── .env.example
    │   ├── Dockerfile
    │   └── captain-definition
    └── frontend/
        ├── src/
        │   ├── api/cartas.ts           # funções fetch pros 5 endpoints, usando VITE_API_URL
        │   ├── components/CardItem.tsx
        │   ├── pages/ListaCartas.tsx
        │   ├── pages/FormularioCarta.tsx
        │   ├── App.tsx                 # rotas
        │   └── main.tsx
        ├── package.json
        ├── vite.config.ts
        ├── .env.example                # VITE_API_URL=http://localhost:3000
        ├── Dockerfile
        └── captain-definition
```

### Estratégia de branches (múltiplas tentativas)

Cada tentativa de implementação (ex: modelos de IA diferentes, ou níveis diferentes de contexto fornecido) vive na sua própria branch dentro deste **mesmo** repositório:

- `main` — a implementação guiada pelas Tarefas 1-3 (`SDD/prompts/`), contexto completo/curado. É a entrega oficial.
- `experimento/contexto-minimo` — tentativa da mesma feature com contexto mínimo (ver `teste-curadoria-contexto.md`), fica só pra comparação, não é a entrega.
- `experimento/modelo-*` (opcional, ex: `experimento/modelo-gpt`) — a mesma feature rodada com um modelo de IA diferente, pra comparação qualitativa na apresentação. **Isso não substitui o requisito 3 do trabalho** (que exige comparar quantidade de contexto, não modelo) — é conteúdo extra, não a evidência oficial.

Pra apresentar um resultado de outra branch: `git checkout <branch>`, depois `caprover deploy` de dentro de `apps/backend/` e de `apps/frontend/` novamente (reaponta os dois apps CapRover pro conteúdo daquela branch). Isso sobrescreve o deploy anterior — se quiser manter os dois resultados publicados ao mesmo tempo, precisaria de apps CapRover extras (fora do escopo padrão deste plano).

## 3. Schema do banco

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

Roda uma vez, manualmente, no Postgres provisionado no CapRover (via `psql` ou client de sua preferência). Sem migration tool — é uma tabela, não precisa.

## 4. Contrato de API

Base: `/api/cartas`, servida pelo app `backend` (URL própria no CapRover, diferente da URL do `frontend`).

| Método | Rota | Body | Resposta | Uso |
|---|---|---|---|---|
| `GET` | `/api/cartas` | — | `200` array de Carta | listagem |
| `GET` | `/api/cartas/:id` | — | `200` Carta / `404` | pré-preencher formulário de edição |
| `POST` | `/api/cartas` | `{nome, numero, colecao, imagem_url?}` | `201` Carta | criar |
| `PUT` | `/api/cartas/:id` | `{nome, numero, colecao, imagem_url?}` | `200` Carta / `404` | editar |
| `DELETE` | `/api/cartas/:id` | — | `204` / `404` | excluir |

Sem paginação, sem query params de filtro (fora de escopo, ver `spec.md`).

**CORS**: como `backend` e `frontend` são apps/origens diferentes (dois domínios distintos em produção, mesmo estando no mesmo repositório), o backend precisa habilitar CORS. Sem autenticação/cookies envolvidos, `cors()` sem restrição de origem é suficiente pro escopo deste protótipo — não precisa lista de origens permitidas.

## 5. Frontend — rotas

| Rota | Componente | Comportamento |
|---|---|---|
| `/` | `ListaCartas` | grade de cards + botão "Criar Carta"; clique no card abre popover Editar/Excluir |
| `/cartas/nova` | `FormularioCarta` | modo criação, campos vazios, `POST` ao salvar |
| `/cartas/:id/editar` | `FormularioCarta` | modo edição, busca `GET /api/cartas/:id`, `PUT` ao salvar |

`FormularioCarta` é o **mesmo componente** nos dois modos — o modo é decidido pela presença do param `:id` na rota, não duplicar componente.

**Base da API**: como o frontend não é servido pelo mesmo processo do backend, todas as chamadas em `api/cartas.ts` usam `import.meta.env.VITE_API_URL` como prefixo (ex: `${VITE_API_URL}/api/cartas`), nunca caminho relativo. Em desenvolvimento local, `apps/frontend/.env` aponta pro backend local (`http://localhost:3000`); em produção, a env var é configurada no build do CapRover apontando pra URL pública do app `backend`.

## 6. Deploy (CapRover) — dois apps, um repositório, via CLI

> Feito manualmente por você, fora do fluxo de tasks de IA (`tasks.md` só cobre até rodar em localhost). Fica aqui como referência técnica pra quando for configurar.

Como `apps/backend` e `apps/frontend` são subpastas do mesmo repositório (não repositórios próprios), o deploy usa a **CapRover CLI** (`caprover deploy`) rodada de dentro de cada subpasta — ela empacota só o conteúdo daquele diretório e sobe direto, sem depender de webhook/integração do CapRover com o GitHub observando a raiz do repo.

### App `backend`

1. `cd apps/backend`, `caprover deploy` (usa o `Dockerfile` e `captain-definition` da própria subpasta).
2. `captain-definition`:
   ```json
   { "schemaVersion": 2, "dockerfilePath": "./Dockerfile" }
   ```
3. Variáveis de ambiente no CapRover: `DATABASE_URL` (connection string do Postgres) e `PORT` (o server deve ler `process.env.PORT`).
4. Banco: app de Postgres via one-click apps do CapRover (ou instância externa já configurada) — não faz parte deste container.
5. Rodar `init.sql` manualmente no Postgres antes do primeiro deploy funcionar de ponta a ponta.

### App `frontend`

1. `cd apps/frontend`, `caprover deploy` (Dockerfile multi-stage: stage 1 `npm run build` com Vite; stage 2 `node:*-alpine` servindo `dist/` com o pacote `serve`, ex: `serve -s dist -l $PORT`).
2. `captain-definition` da subpasta, mesmo formato do backend.
3. Variável de ambiente `VITE_API_URL` configurada **no build** do CapRover (Vite embute env vars em build-time, não runtime) apontando pra URL pública do app `backend` já deployado — por isso o backend precisa subir primeiro.

Isso satisfaz o requisito do trabalho de "URL publicada e acessível, não só rodar local" (`INSTRUCOES-TRABALHO.md`, seção 6) — cada app CapRover expõe sua própria URL pública; a URL que vai no README (seção 7) é a do `frontend`.
