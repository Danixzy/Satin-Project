# Revisão Final (Tarefa 4) — Gestão de Cartas

> Relatório do subagente `revisor-sdd`, rodado sobre `apps/backend/` e `apps/frontend/` completos (Tarefas 1-3), contra `SDD/spec.md` e `SDD/plan.md`. Evidência da Tarefa 4 (`SDD/tasks.md`), junto com o print da chamada.

Revisão de sistema completo: `apps/backend/` e `apps/frontend/` contra `SDD/spec.md` e `SDD/plan.md`.

## (a) Achados de divergência, por severidade

**Nenhuma divergência de fonte de verdade encontrada.** Não há campo, rota, tela ou tabela inventados.

**Nenhum item fora de escopo encontrado.** Não há autenticação, upload de arquivo, paginação, busca, filtro, ordenação, campos extras (raridade/categoria/preço/etc.) ou testes automatizados em nenhum dos arquivos revisados.

**Nenhuma inconsistência de padrão entre arquivos da mesma camada.**

Detalhamento do que foi checado e confirmado correto:

- **Entidade**: `apps/frontend/src/api/cartas.ts:1-8` (`Carta`) e `apps/backend/init.sql:1-8` têm exatamente `id, nome, numero, colecao, imagem_url, created_at`. `numero` é `text`/`string` em ambos os lados, nunca numérico.
- **Rotas de API**: `apps/backend/src/routes/cartas.js` tem exatamente os 5 endpoints (`GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`), montados em `/api/cartas` por `server.js:10`. Sem query params de filtro/paginação.
- **Rotas de tela**: `apps/frontend/src/App.tsx:7-11` tem exatamente as 3 rotas do plano, e `FormularioCarta` é um componente único reaproveitado nos dois modos via `useParams().id` (`FormularioCarta.tsx:6-8`) — não há componentes duplicados de criar/editar.
- **Padrão do backend**: todos os 5 endpoints seguem exatamente o padrão do primeiro (`GET /`, linhas 6-13): `try/catch`, `pool.query` direto (sem ORM/service/repository), erro no formato `{ erro: '...' }` com `status(500)`, e `404` com `{ erro: '...' }` quando aplicável. Nomenclatura de variável (`result`) consistente em todos.
- **Padrão do frontend**: todas as 5 funções em `api/cartas.ts` usam `import.meta.env.VITE_API_URL` como prefixo (linha 17 + uso em todas as chamadas `fetch`), nunca caminho relativo. Nenhuma função foge desse padrão.
- **CORS**: `server.js:8` usa `cors()` sem restrição de origem, exatamente como `plan.md` seção 4 permite explicitamente pro escopo do protótipo.
- **Sem ORM/camada extra**: `pg` usado diretamente em `routes/cartas.js`, sem service/repository, conforme `plan.md` seção 1.

## (b) Descompassos de integração entre backend e frontend

**Nenhum descompasso encontrado.** Especificamente:

- Corpo de `POST`/`PUT` enviado pelo frontend (`CartaInput` em `api/cartas.ts:10-15`) bate exatamente com o `req.body` desestruturado no backend (`cartas.js:17` e `:42`): `nome, numero, colecao, imagem_url`.
- Resposta do backend (`select * from cartas`) bate exatamente com o tipo `Carta` do frontend — nenhum campo do banco fica sem uso, nenhum campo esperado pelo frontend fica sem vir do banco.
- Código de status: `201` no create, `200`/`404` no get/put, `204`/`404` no delete — o frontend (`api/cartas.ts`) checa `res.ok` genericamente, compatível com todos esses códigos.
- `imagem_url` vazio no formulário vira `undefined` (`FormularioCarta.tsx:34`), que o `JSON.stringify` omite do body; o backend trata a ausência da chave como `undefined || null` (`cartas.js:20,45`) — o nulo cai certinho no schema `imagem_url text` (nullable). Coerente ponta a ponta com a regra "se vazio, placeholder" do `spec.md` seção 4.

## (c) Cobertura dos 8 critérios de aceite (`spec.md` seção 6)

| # | Critério | Coberto? | Onde |
|---|---|---|---|
| 1 | Listagem carrega cartas ao abrir a página | **Sim** | `ListaCartas.tsx:11-15` — `useEffect` com `[]` chama `listarCartas()` no mount. |
| 2 | Botão "Criar Carta" sempre visível, canto superior direito, mesmo com lista vazia | **Sim** | `ListaCartas.tsx:25-27` renderiza o botão fora de qualquer condicional (antes do `if carregando/vazio/grade`); `index.css:14-18` fixa `position: fixed; top; right`. |
| 3 | Criar carta aparece na listagem sem refresh manual | **Sim** | Ver análise abaixo — `navigate('/')` em `FormularioCarta.tsx:42` remonta `ListaCartas`, que refaz o fetch. |
| 4 | Clicar no card mostra Editar/Excluir, sem navegar direto | **Sim** | `CardItem.tsx:15` — `onClick` no card alterna `menuAberto`; a navegação só ocorre no clique do botão "Editar" dentro do menu (`:29`), com `stopPropagation`. |
| 5 | Editar abre formulário com os 4 campos preenchidos | **Sim** | `FormularioCarta.tsx:16-24` — `useEffect([id])` busca a carta e preenche `nome, numero, colecao, imagemUrl` (os 4 campos, nada a mais/menos). |
| 6 | Salvar edição atualiza o card na listagem | **Sim** | Mesmo mecanismo do item 3 — `atualizarCarta` seguido de `navigate('/')` remonta `ListaCartas`, que refaz `GET /api/cartas`. |
| 7 | Excluir pede confirmação | **Sim** | `ListaCartas.tsx:18` — `window.confirm(\`Excluir ${carta.nome}?\`)`, texto igual ao formato pedido no `spec.md` seção 5. |
| 8 | Excluir remove o card sem refresh manual | **Sim** | `ListaCartas.tsx:19-20` — após `excluirCarta` resolver, `setCartas` filtra localmente o item removido (atualização otimista de estado, não depende de reload). |

### Sobre a checagem cuidadosa pedida (itens 3 e 6 — refresh sem reload)

Verificação específica se `ListaCartas` de fato refaz o fetch ao voltar da tela de formulário, em vez de depender de estado compartilhado que poderia ficar obsoleto.

- `App.tsx:7-11` define `ListaCartas` e `FormularioCarta` como elementos de `Route` distintos e mutuamente exclusivos sob o mesmo `<Routes>`.
- Ao navegar de `/` para `/cartas/nova` (ou `/cartas/:id/editar`), o React Router desmonta a instância de `ListaCartas` e monta uma nova instância de `FormularioCarta`.
- Ao chamar `navigate('/')` de dentro do formulário após salvar, o inverso acontece: `FormularioCarta` é desmontado e uma **instância nova** de `ListaCartas` é montada.
- Como é uma montagem nova (não uma re-renderização da mesma instância), o `useEffect` com array de dependências vazio (`ListaCartas.tsx:11-15`) dispara de novo, refazendo `GET /api/cartas` e populando o estado com os dados atualizados do banco (incluindo a carta recém-criada/editada).

Não foi encontrado nenhum caminho em que o estado ficaria desatualizado sem refresh manual — não há guarda de "já montado antes" nem estado global compartilhado entre as duas telas que pudesse ficar stale. O mecanismo depende inteiramente do comportamento padrão de montagem/desmontagem do React Router v6 ao trocar de rota, o que está correto para este caso.

## Observação sobre tratamento de erro (não reportado como achado)

`ListaCartas.tsx:12-14` (`listarCartas().then(setCartas).finally(...)`) e `FormularioCarta.tsx:18-23` (`buscarCarta(id).then(...)`) não têm `.catch()` — se a API retornar erro, a promise rejeita silenciosamente (unhandled rejection) sem UI de erro. Não reportado como achado porque `spec.md`/`plan.md` não definem um contrato de tratamento de erro pro carregamento inicial, e o padrão é consistente entre as duas páginas (não há divergência de estilo entre elas) — fica registrado aqui só como observação, não como divergência.

---

**Arquivos revisados**: `apps/backend/src/db.js`, `apps/backend/src/routes/cartas.js`, `apps/backend/src/server.js`, `apps/backend/init.sql`, `apps/backend/package.json`, `apps/backend/.env.example`, `apps/frontend/src/api/cartas.ts`, `apps/frontend/src/components/CardItem.tsx`, `apps/frontend/src/pages/ListaCartas.tsx`, `apps/frontend/src/pages/FormularioCarta.tsx`, `apps/frontend/src/App.tsx`, `apps/frontend/src/main.tsx`, `apps/frontend/src/index.css`, `apps/frontend/package.json`, `apps/frontend/.env.example`.

**Conclusão**: nenhuma divergência real encontrada, todos os 8 critérios de aceite cobertos estaticamente pelo código. Validação dinâmica (rodar de fato no navegador) ainda pendente — feita manualmente pelo autor, fora do fluxo de tasks de IA, já que este ambiente não tinha `npm` disponível para instalar dependências e subir os servidores.
