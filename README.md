# Gestão de Cartas — Trabalho Prático 1 (Tecnologias Emergentes)

> Preenchido na ordem exigida por `SDD/docs/INSTRUCOES-TRABALHO.md` seção 8. Item marcado como **PENDENTE** ainda falta (deploy) — o restante está completo. Todo item marcado "com evidências" precisa de print de tela antes da entrega final; texto sozinho não vale como evidência.

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

Few-shot é dar pra IA um exemplo pronto do que você quer, em vez de só descrever em texto — ela aprende o padrão copiando o exemplo, não interpretando uma explicação abstrata.

É a regra 4 do system prompt: a primeira coisa implementada em cada camada (o primeiro pedaço de backend, o primeiro componente de tela) vira o exemplo que tudo depois dela deve imitar — mesmo estilo, mesmos nomes, mesmo jeito de tratar erro.

**Por que usar isso aqui:** o projeto tem várias peças parecidas sendo criadas em chamadas separadas (backend e frontend, cada um com várias partes). Sem um exemplo fixo, cada chamada decide esses detalhes de um jeito diferente — não porque a lógica é difícil (é um CRUD simples), mas porque nada obriga uma chamada nova a copiar o estilo da anterior. Dar um exemplo resolve isso direto, sem precisar de um prompt de raciocínio passo a passo (chain-of-thought), que não ajudaria aqui — não tem raciocínio complexo pra fazer, só padrão pra repetir.

**Funcionou:** tudo que foi implementado depois do primeiro exemplo seguiu o mesmo padrão dele — mesmo formato de erro, mesmo jeito de nomear e organizar o código.

## 4. Teste de curadoria de contexto

Procedimento planejado em [`SDD/teste-curadoria-contexto.md`](SDD/teste-curadoria-contexto.md): a mesma feature implementada duas vezes, variando a quantidade de contexto fornecido, comparando **resultado** e **tokens consumidos**. A execução real desviou um pouco do prompt curtíssimo originalmente planejado pra Tentativa 1 — o motivo e o efeito disso estão explicados abaixo, junto com o resultado de verdade.

- **Tentativa 1 (contexto mínimo, branch `sem-contexto`):** chat novo, sem `CLAUDE.md`, sem `SDD/plan.md`, sem os exemplos few-shot já implementados no projeto e sem o subagente `revisor-sdd` checando o resultado. Diferente do plano original (prompt curto deixando a IA inventar os campos sozinha), o prompt colou o **texto completo da especificação funcional** (o mesmo conteúdo de `SDD/spec.md`) direto no chat — sem carregar mais nada do projeto real. Isso testa uma variação mais realista do requisito 3: "colar a spec inteira crua, sem o resto do projeto" vs. "contexto curado e carregado como convenção do projeto" (mesma spec nos dois casos, arquitetura/ferramental diferente).
- **Tentativa 2 (pacote completo, branch `contexto`, é a implementação principal do repositório):** Tarefas 1-4, guiadas por `SDD/spec.md` + `SDD/plan.md`, `CLAUDE.md` carregado, few-shot entre chamadas (seção 3) e revisão automática pelo `revisor-sdd` ao final.

**Conclusão:** com a spec inteira colada no prompt, a IA não inventa campo/rota — isso a spec resolve sozinha. O que se perde sem o contexto do projeto real é justamente o que `INSTRUCOES-TRABALHO.md` seção 2 avisa: **consistência com o resto do sistema**. Numa chamada isolada, cada detalhe não coberto pela spec (nome de função, idioma da chave de erro, abordagem técnica de UI, nível de acabamento visual) é decidido do zero e independente — em um projeto real com múltiplos endpoints/telas, isso vira inconsistência de estilo acumulada entre arquivos, exatamente o risco que a regra 4 do system prompt (seção 3, few-shot) existe pra mitigar. Custo é outra consequência direta: a Tentativa 1 saiu mais barata porque foi uma tacada única sem estrutura, review ou iteração orientada por spec/plan — barato, mas sem nenhuma garantia de coerência com o projeto real, só com a spec isolada.

Evidência de custo — ver seção 6.

## 5. Tabela de chamadas

Inclui as Tarefas 1-4 de implementação (branch `contexto`) e a Tentativa 1 do teste de curadoria de contexto (branch `sem-contexto`, seção 4). As linhas 6-7 (teste complementar, opcional) não foram executadas.

| # | Chamada | Branch | Ferramenta/Modelo | Tokens in | Tokens out | Custo (US$) | Print |
|---|---|---|---|---|---|---|---|
| 1 | Tarefa 1 — setup do projeto | `contexto` | Claude Code — sonnet-5 (15 chamadas) | 923.705 (30 frescos + 120.211 cache criado + 803.464 cache lido) | 13.394 | US$ 1,98 pela fórmula (in $2,00/1M + out $10,00/1M, preço promo Sonnet 5 até 2026-08-31) | ⬜ |
| 2 | Tarefa 2 — backend completo | `contexto` | Claude Code — sonnet-5 (delta desde a Tarefa 1, 17 chamadas) | 1.984.088 (delta; acumulado da sessão: 2.907.793) | 11.957 (delta; acumulado: 25.351) | US$ 4,09 pela fórmula (delta) | ⬜ |
| 3 | Tarefa 3 — frontend completo (+ validação local) | `contexto` | Claude Code — sonnet-5 (delta desde a Tarefa 2, 8 chamadas) | 1.140.362 (delta; acumulado da sessão: 4.048.155) | 13.569 (delta; acumulado: 38.920) | US$ 2,42 pela fórmula (delta) | ⬜ |
| 4 | Tarefa 4 — revisão final | `contexto` | Claude Code — sonnet-5 (delta desde a Tarefa 3, 6 chamadas) | 947.022 (delta; acumulado da sessão: 4.995.177) | 7.518 (delta; acumulado: 46.438) | US$ 1,97 pela fórmula (delta), **US$ 9,70 real via `/cost`** (sessão inteira Tarefas 1-4) | ✅ `relatorios/custo_implementacao_contexto.png` |
| 5 | Tentativa 1 — contexto mínimo (spec colada crua, sem projeto real) | `sem-contexto` | Claude Code — sonnet-5 (75 chamadas) | 5.348.675 (150 frescos + 159.032 cache criado + 5.189.493 cache lido) | 37.845 | US$ 11,08 pela fórmula, **US$ 2,28 real via `/cost`** (divergência grande: quase toda a entrada é cache lido, que custa uma fração do preço cheio) | ✅ `relatorios/custo_implementacao_sem_contexto.png` |
| 6 | complementar (opcional) — arquivo inteiro | — | não executado | — | — | — | ⬜ |
| 7 | complementar (opcional) — trecho curado | — | não executado | — | — | — | ⬜ |

**Total (Tarefas 1-4 + Tentativa 1; linhas 6-7 opcionais, não executadas):**
- **Tokens in:** 10.343.852
- **Tokens out:** 84.283
- **Custo:** ≈ **US$ 11,98**, conferido contra `/cost` real (US$ 9,70 Tarefas 1-4 + US$ 2,28 Tentativa 1) — a estimativa pela fórmula pura (sem separar cache) batia bem mais alto nas Tarefas 1-4 (~US$ 10,45) e muito mais alto na Tentativa 1 (~US$ 11,08 vs. US$ 2,28 real), porque a fórmula trata todo token de entrada pelo preço cheio e a maior parte da entrada em qualquer sessão do Claude Code é cache lido, bem mais barato. Ver `SDD/log-chamadas.md` pra metodologia e ressalvas.

## 6. Print/export do dashboard ou log da ferramenta

Print do `/cost` do Claude Code, um por branch/experimento, comprovando os números da linha 4 e da linha 5 da tabela da seção 5:

**Tarefas 1-4, branch `contexto`** — US$ 9,70, sonnet-5 com 12,9k tokens frescos de entrada, 131,7k de saída, 18,4M de cache lido, 404,1k de cache escrito:

![Custo da implementação com contexto (Tarefas 1-4)](custo_implementacao_contexto.png)

**Tentativa 1, branch `sem-contexto`** — US$ 2,28, sonnet-5 com 3,2k tokens frescos de entrada, 29,5k de saída, 4,9M de cache lido, 61,4k de cache escrito:

![Custo da implementação sem contexto (Tentativa 1)](custo_implementacao_sem_contexto.png)

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

- [`SDD/spec.md`](SDD/spec.md) — o que a feature faz (fonte de verdade)
- [`SDD/plan.md`](SDD/plan.md) — arquitetura, contrato de API, schema, deploy
- [`SDD/tasks.md`](SDD/tasks.md) — checklist de implementação (4 tarefas, branch `contexto`)
- [`SDD/prompts/`](SDD/prompts/) — um prompt pronto por tarefa, contexto já curado
- [`.claude/template/task-prompt.template.md`](.claude/template/task-prompt.template.md) — modelo pra criar novos prompts de tarefa
- [`.claude/agents/revisor-sdd.md`](.claude/agents/revisor-sdd.md) — subagente revisor (confere código contra spec/plan)
- [`.claude/skills/custo-sessao/`](.claude/skills/custo-sessao/) — skill que extrai tokens/custo do transcript
- [`SDD/system-prompt.md`](SDD/system-prompt.md) — system prompt + justificativa da técnica
- [`SDD/teste-curadoria-contexto.md`](SDD/teste-curadoria-contexto.md) — procedimento do requisito 3
- [`SDD/log-chamadas.md`](SDD/log-chamadas.md) — log de tokens/custo por chamada