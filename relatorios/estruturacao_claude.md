# Estruturação do `.claude/` — ferramental e custo por modelo

> Fase 0b: depois de fechar a documentação SDD (ver `estruturacao_workspace.md`), esta etapa configurou o ferramental do Claude Code que sustenta o fluxo de implementação. Ela é interessante pro trabalho por dois motivos: mostra engenharia de contexto aplicada (carregar instrução só quando ela importa) e produziu uma **medição limpa de custo Opus vs. Sonnet**, com troca de modelo no meio da mesma sessão.

## O que foi configurado

| Artefato | Caminho | Pra que serve |
|---|---|---|
| Subagente `revisor-sdd` | `.claude/agents/revisor-sdd.md` | Confere o código gerado contra `SDD/spec.md`/`SDD/plan.md` e aponta campo, rota ou tela inventados — o risco que o enunciado descreve na seção 2 |
| Memória do agente | `.claude/agent-memory/revisor-sdd/MEMORY.md` | Invariantes do projeto (campos canônicos, rotas) + divergências recorrentes que o revisor aprende ao longo das revisões |
| Rule path-scoped | `.claude/rules/convencoes-apps.md` | Convenções de código que entram em contexto **só** quando um arquivo de `apps/` está em jogo |
| Skill `custo-sessao` | `.claude/skills/custo-sessao/` | Extrai tokens/custo do transcript e monta a linha de `SDD/log-chamadas.md` |

### Por que isso é engenharia de contexto, não enfeite

A divisão entre os três mecanismos é deliberada e é exatamente o tema "janela de contexto / economia de tokens" da disciplina:

- **`CLAUDE.md`** carrega em toda sessão → só o workflow (uma tarefa por vez, quais arquivos são fonte de verdade).
- **Rule com `paths:`** carrega só quando o Claude toca em `apps/**` → convenções de código (CORS, `VITE_API_URL`, sem ORM). Não ocupa contexto enquanto estamos só editando documentação.
- **Skill** carrega só quando invocada → o procedimento de extrair tokens, que não precisa estar em contexto o tempo todo.

Detalhe observado na prática: declarei o agente com `tools: Read, Grep, Glob` (read-only), mas ao carregar ele aparece com `Read, Grep, Glob, Write, Edit` — o `memory: project` adiciona sozinho as ferramentas de escrita pro agente conseguir manter os próprios arquivos de memória, como a documentação descreve.

## Custo: a troca de modelo no meio da sessão

Esta é a parte que vale levar pra apresentação. A mesma sessão rodou **Sonnet 5** até a documentação SDD ficar pronta e **Opus 5** daí em diante, com fronteira limpa (última chamada Sonnet 04:47:48 UTC, primeira Opus 04:57:14 UTC — sem intercalar).

### Dois checkpoints do `/cost`

| | Checkpoint A | Checkpoint B |
|---|---|---|
| Quando | 05:01 UTC (fim do SDD) | 05:09 UTC (fim do `.claude/`) |
| `/cost` acumulado | **US$ 7,62** | **US$ 14,70** |

**Entre os dois checkpoints, o Sonnet não fez nenhuma chamada nova** (ficou em 109 nas duas medições). Ou seja: o delta de **+US$ 7,08** é 100% atribuível ao Opus, gasto pra construir 1 agente + 1 rule + 1 skill + a memória do agente.

### Tokens por modelo (snapshot 05:09 UTC — sessão ainda aberta)

| | Sonnet 5 | Opus 5 |
|---|---|---|
| Chamadas | 109 | 37 |
| Entrada total | 14.945.844 | 7.118.871 |
| Entrada por chamada | 137.117 | 192.401 |
| Cache lido (% da entrada) | 14.614.936 (98%) | 6.902.416 (97%) |
| Saída | 133.862 | 38.976 |
| Raciocínio (% da saída) | 57.411 (42%) | 12.773 (32%) |

### O que explica o salto — e o que **não** explica

A hipótese intuitiva ("Opus em esforço alto pensa mais, logo gasta mais") **não se sustenta nos dados**: o Opus produziu proporcionalmente *menos* tokens de raciocínio (32% da saída) que o Sonnet (42%), e menos saída em termos absolutos. O salto de custo vem de dois outros fatores:

1. **Preço por token do modelo.** Opus é substancialmente mais caro que Sonnet por token — esse é o fator dominante.
2. **Contexto acumulado.** Cada chamada Opus carregou em média 192K tokens de entrada contra 137K das chamadas Sonnet, porque a conversa já estava longa quando o modelo trocou. Em sessão longa, o custo por chamada cresce mesmo sem o pedido ficar maior.

Ordem de grandeza derivada dos próprios números: as 19 chamadas Opus entre os checkpoints custaram ~US$ 0,37 cada. As 109 chamadas Sonnet custaram, no máximo, US$ 7,62 no total (limite superior, já que esse acumulado incluía as 15 primeiras chamadas Opus) — ou seja, **menos de US$ 0,07 por chamada**. Opus saiu pelo menos ~5x mais caro por chamada neste fluxo, provavelmente bem mais.

> Esses números por chamada são **estimativas derivadas**, não medição direta: o `/cost` dá o acumulado da sessão, não o custo por modelo. Pra ter número rigoroso, ver a sugestão abaixo.

## Como transformar isso em evidência rigorosa (aproveita a ideia das branches)

Vocês já queriam rodar a mesma feature em modelos diferentes por branch (`plan.md` seção 2). Dá pra fazer isso virar medição limpa em vez de estimativa:

1. Anote o `/cost` **antes** de começar a branch.
2. Rode as 3 tarefas inteiras num modelo só.
3. Anote o `/cost` **depois**. A diferença é o custo daquele modelo pra feature inteira.
4. Repita na outra branch, com outro modelo, a partir de uma sessão nova (pra não herdar o contexto acumulado da anterior, que distorce a comparação).

Isso dá uma tabela "mesma feature, mesmo prompt, modelos diferentes, custo medido" — material forte pra apresentação, e complementa (sem substituir) o requisito 3, que é sobre variação de *contexto*.

## Decisão pendente pro README

Esta fase e a Fase 0 são **meta-trabalho**: construíram a documentação e o ferramental, não a feature avaliada. Juntas já consumiram US$ 14,70, provavelmente mais que as 3 tarefas de implementação vão consumir.

Sugestão: **incluir na tabela do README, claramente rotuladas como fase de preparação**, separadas das Tarefas 1-3. Isso é mais honesto que omitir (o enunciado pede "todas as chamadas feitas") e ainda rende discussão boa na apresentação — o custo real de um fluxo guiado por documentação está no preparo, e ele se paga em consistência na hora de gerar o código.

## Evidência a capturar

- [ ] Print do `/cost` mostrando US$ 14,70 (ou o valor no momento da entrega).
- [ ] Print do `/context` mostrando a rule path-scoped **fora** do contexto ao editar documentação e **dentro** ao editar `apps/**` — evidência visual e direta de curadoria de contexto.
- [ ] Saída da skill `custo-sessao` com a quebra por modelo (comando em `.claude/skills/custo-sessao/SKILL.md`).
