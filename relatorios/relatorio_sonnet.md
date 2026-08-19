# Gestão de Cartas — Trabalho Prático 1 (Tecnologias Emergentes)

> Preenchido na ordem exigida por `SDD/docs/INSTRUCOES-TRABALHO.md` seção 8. Itens marcados como **PENDENTE** ainda faltam (curadoria de contexto e deploy) — o restante está completo. Todo item marcado "com evidências" precisa de print de tela antes da entrega final; texto sozinho não vale como evidência.

## 1. O que o projeto faz

Feature isolada da Escola de TI (opção "feature pequena e isolada", `INSTRUCOES-TRABALHO.md` seção 2): uma página de gestão de cartas de colecionáveis — listar, criar, editar e excluir. Escopo completo em [`SDD/spec.md`](SDD/spec.md). Não integra com o sistema real do app (ver `SDD/docs/user-stories.md`); é um protótipo full-stack implementado com apoio de IA:

- **Backend**: Node.js + Express + `pg` (sem ORM), API REST em `/api/cartas` (`apps/backend`).
- **Frontend**: React + Vite + TypeScript + `react-router-dom` (`apps/frontend`).
- **Banco**: PostgreSQL, uma tabela (`cartas`).

Arquitetura completa, contrato de API e schema do banco em [`SDD/plan.md`](SDD/plan.md).

## 2. System prompt usado (completo)

Definido e documentado **antes** de começar a construir (requisito 1). Usado em toda chamada de implementação via `CLAUDE.md` na raiz do repositório. Justificativa completa em [`SDD/system-prompt.md`](SDD/system-prompt.md).

```
Você é um engenheiro de software full-stack responsável por implementar, uma a uma,
as tasks descritas em SDD/tasks.md deste repositório.

Regras:
1. Antes de implementar uma task, releia SDD/spec.md (o que a feature deve fazer) e
   SDD/plan.md (stack, schema do banco, contrato de API, estrutura de pastas) — eles
   são a fonte de verdade. Nunca invente campo, rota ou tela que não esteja neles.
2. Implemente exatamente uma task por vez, na ordem em que aparecem em SDD/tasks.md,
   e pare ao final de cada uma para revisão antes de seguir pra próxima.
3. Este é um protótipo de feature isolada — não adicione autenticação, permissões,
   upload de imagem, paginação, testes automatizados ou qualquer coisa fora do escopo
   do spec, mesmo que pareça "faltar".
4. A partir do segundo endpoint de API e do segundo componente de tela implementados,
   siga o mesmo padrão de estrutura, nomenclatura e tratamento de erro já usado no
   primeiro exemplo daquela camada — não varie estilo entre arquivos do mesmo tipo.
5. Não escreva comentários explicando o óbvio. Prefira código direto a abstrações —
   é um CRUD de 4 operações, não precisa de camada de service/repository separada.
6. Se uma decisão não estiver coberta pelo plan.md (ex: biblioteca de UI, nome exato
   de uma variável), decida da forma mais simples possível e siga; não pare para
   perguntar coisas de baixo impacto.
```

**Por que esse system prompt:** as regras 1 e 3 amarram a IA à spec/plan como fonte de verdade — sem isso, uma LLM sem contexto do projeto tende a inventar decisão errada ou gerar algo desconectado (o risco que `INSTRUCOES-TRABALHO.md` seção 2 avisa sobre features isoladas). A regra 2 faz cada task virar uma chamada isolada e rastreável, alimentando diretamente a tabela do requisito 4. Detalhamento completo em `SDD/system-prompt.md`.

`[PRINT PENDENTE]` — captura do `CLAUDE.md` carregado na sessão do Claude Code (ex: início de uma das chamadas das Tarefas 1-4).

## 3. Técnica aplicada: Few-shot

A **regra 4** do system prompt acima é a técnica escolhida (requisito 2): depois que o primeiro endpoint de API (`GET /api/cartas`, Tarefa 2) e o primeiro componente de tela (`CardItem.tsx`, Tarefa 3) existem no repositório, eles funcionam como **exemplo (shot)** que as chamadas seguintes devem imitar em estrutura, nomenclatura e tratamento de erro.

**Por que few-shot e não chain-of-thought:** a feature é um CRUD de 4 operações repetido em 2 camadas (API e UI) — o "raciocínio" necessário por task é trivial, não há lógica de negócio complexa que se beneficie de pensar passo a passo. O risco real é **inconsistência de estilo** entre os 5 endpoints e os 3 componentes/páginas gerados em chamadas separadas. Ancorar cada chamada nova no exemplo já implementado resolve exatamente esse risco, sem pagar o custo de tokens extra de um prompt de CoT que essa lógica simples não justifica. Justificativa completa em `SDD/system-prompt.md`.

**Evidência de que funcionou** (checado pelo subagente `revisor-sdd` ao final de cada tarefa e na revisão final — relatório completo em [`relatorios/revisao-final-tarefa4.md`](relatorios/revisao-final-tarefa4.md)):
- Backend: `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` em `apps/backend/src/routes/cartas.js` seguem exatamente o padrão de `try/catch`, formato de erro `{ erro: '...' }` e nomenclatura (`result`) definido por `GET /api/cartas`.
- Frontend: `ListaCartas.tsx` e `FormularioCarta.tsx` seguem o mesmo padrão de export (`function X() {}` + `export default X`) definido por `CardItem.tsx`, o primeiro componente implementado.

`[PRINT PENDENTE]` — captura mostrando lado a lado o endpoint/componente de referência e um dos que seguiu o padrão.

## 4. Teste de curadoria de contexto — **PENDENTE**

Procedimento definido em [`SDD/teste-curadoria-contexto.md`](SDD/teste-curadoria-contexto.md): a mesma feature implementada duas vezes, variando a quantidade de contexto fornecido, comparando **resultado** (o que a IA inventou sem a spec) e **tokens consumidos**.

- **Tentativa 1 (contexto mínimo, branch `experimento/contexto-minimo`):** ainda não executada.
- **Tentativa 2 (pacote completo, branch `main`):** é a implementação deste repositório — Tarefas 1-4, guiadas por `SDD/spec.md` + `SDD/plan.md`, `CLAUDE.md` carregado. Tokens: ver seção 5 abaixo (linhas 1-4 da tabela).
- **Comparação:** pendente até a Tentativa 1 rodar.

Ação pendente antes da entrega: rodar a Tentativa 1 (prompt e branch já definidos em `SDD/teste-curadoria-contexto.md`), preencher a linha 5 (e opcionalmente 6-7, teste complementar) de `SDD/log-chamadas.md`, e completar esta seção com a comparação real de tokens e divergências encontradas.

## 5. Tabela de chamadas

Inclui a Fase 0 (estruturação do próprio SDD — spec, plan, tasks, prompts, ferramental `.claude/` — detalhada em `relatorios/estruturacao_workspace.md` e `relatorios/estruturacao_claude.md`) e as Tarefas 1-4 de implementação (branch `main`). As linhas 5-7 (teste de curadoria de contexto) ficam pendentes até a seção 4 ser concluída.

| # | Chamada | Branch | Ferramenta/Modelo | Tokens in | Tokens out | Custo (US$) | Print |
|---|---|---|---|---|---|---|---|
| 0a | Fase 0 — estruturação do SDD, ver `relatorios/estruturacao_workspace.md` | — | Claude Code — sonnet-5 (109 chamadas) | 14.945.844 (218 frescos + 330.690 cache criado + 14.614.936 cache lido) | 133.862 | ≤ US$ 7,62 acumulado no checkpoint (via `/cost`) | ⬜ |
| 0b | Fase 0b — ferramental `.claude/`, ver `relatorios/estruturacao_claude.md` | — | Claude Code — opus-5 (37 chamadas) | 7.118.871 (74 frescos + 216.381 cache criado + 6.902.416 cache lido) | 38.976 | +US$ 7,08 no delta Opus → **US$ 14,70 acumulado** | ⬜ |
| 1 | Tarefa 1 — setup do projeto | `main` | Claude Code — sonnet-5 (15 chamadas) | 923.705 (30 frescos + 120.211 cache criado + 803.464 cache lido) | 13.394 | US$ 1,98 pela fórmula (in $2,00/1M + out $10,00/1M, preço promo Sonnet 5 até 2026-08-31) | ⬜ |
| 2 | Tarefa 2 — backend completo | `main` | Claude Code — sonnet-5 (delta desde a Tarefa 1, 17 chamadas) | 1.984.088 (delta; acumulado da sessão: 2.907.793) | 11.957 (delta; acumulado: 25.351) | US$ 4,09 pela fórmula (delta) | ⬜ |
| 3 | Tarefa 3 — frontend completo (+ validação local) | `main` | Claude Code — sonnet-5 (delta desde a Tarefa 2, 8 chamadas) | 1.140.362 (delta; acumulado da sessão: 4.048.155) | 13.569 (delta; acumulado: 38.920) | US$ 2,42 pela fórmula (delta) | ⬜ |
| 4 | Tarefa 4 — revisão final | `main` | Claude Code — sonnet-5 (delta desde a Tarefa 3, 6 chamadas) | 947.022 (delta; acumulado da sessão: 4.995.177) | 7.518 (delta; acumulado: 46.438) | US$ 1,97 pela fórmula (delta) | ⬜ |
| 5 | Tentativa 1 — contexto mínimo | `experimento/contexto-minimo` | — pendente — | — | — | — | ⬜ |
| 6 | complementar (opcional) — arquivo inteiro | — | — pendente — | — | — | — | ⬜ |
| 7 | complementar (opcional) — trecho curado | — | — pendente — | — | — | — | ⬜ |

**Total parcial (Fase 0 + Tarefas 1-4, linhas 5-7 ainda pendentes):**
- **Tokens in:** 27.059.892
- **Tokens out:** 219.276
- **Custo:** ≈ US$ 25,15 (US$ 14,70 real via `/cost` na Fase 0 + US$ 10,45 pela fórmula nas Tarefas 1-4 — **ainda não conferido contra o `/cost` real dessas 4 chamadas**, que costuma dar um número menor por causa do desconto de cache de leitura)

Este total **não é final** — falta somar as linhas 5-7 (curadoria de contexto, seção 4) antes de fechar a entrega. Metodologia completa e ressalvas sobre cache em [`SDD/log-chamadas.md`](SDD/log-chamadas.md).

## 6. Print/export do dashboard ou log da ferramenta — **PENDENTE**

`[PRINT PENDENTE]` — print do `/cost` do Claude Code (ou export do transcript de `~/.claude/projects/`), comprovando os números da tabela acima. Recomendado rodar `/cost` ao final de cada chamada/tarefa, não só no fim da sessão inteira, pra bater com o formato "por chamada" da tabela.

## 7. URL publicada — **PENDENTE**

Deploy no CapRover ainda não foi feito (dois apps separados — `backend` e `frontend`, via CapRover CLI de dentro de cada subpasta, ver `SDD/plan.md` seção 6). A URL que vai aqui é a do app `frontend`, que consome o `backend` por trás.

`[URL PENDENTE]`

## 8. Alunos participantes

| Nome | RA |
|---|---|
| Lucas de Oliveira Lima | 23000810-2 |
| Lucca Rocha Oliveira | 25184113-2 |
| Daniel Andrade | 23000397-2 |
| Felipe Broetto Araujo | 23167564-2 |
| Felipe Duarte Milleo Consulim | 23011046-2 |

---

## Apêndice — documentação SDD do projeto

- [`relatorios/estruturacao_workspace.md`](relatorios/estruturacao_workspace.md) — Fase 0: como o próprio SDD foi construído (tokens/custo dessa fase)
- [`relatorios/estruturacao_claude.md`](relatorios/estruturacao_claude.md) — Fase 0b: ferramental `.claude/` + comparação de custo Opus vs. Sonnet
- [`relatorios/revisao-final-tarefa4.md`](relatorios/revisao-final-tarefa4.md) — relatório completo da revisão final (Tarefa 4): divergências, integração backend/frontend, cobertura dos 8 critérios de aceite
- [`SDD/spec.md`](SDD/spec.md) — o que a feature faz (fonte de verdade)
- [`SDD/plan.md`](SDD/plan.md) — arquitetura, contrato de API, schema, deploy
- [`SDD/tasks.md`](SDD/tasks.md) — checklist de implementação (4 tarefas, branch `main`)
- [`SDD/prompts/`](SDD/prompts/) — um prompt pronto por tarefa, contexto já curado
- [`.claude/template/task-prompt.template.md`](.claude/template/task-prompt.template.md) — modelo pra criar novos prompts de tarefa
- [`.claude/agents/revisor-sdd.md`](.claude/agents/revisor-sdd.md) — subagente revisor (confere código contra spec/plan)
- [`.claude/skills/custo-sessao/`](.claude/skills/custo-sessao/) — skill que extrai tokens/custo do transcript
- [`SDD/system-prompt.md`](SDD/system-prompt.md) — system prompt + justificativa da técnica
- [`SDD/teste-curadoria-contexto.md`](SDD/teste-curadoria-contexto.md) — procedimento do requisito 3
- [`SDD/log-chamadas.md`](SDD/log-chamadas.md) — log de tokens/custo por chamada