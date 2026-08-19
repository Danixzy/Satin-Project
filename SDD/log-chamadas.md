# Log de Chamadas de IA

> Requisito 4 de `INSTRUCOES-TRABALHO.md`: custo por chamada = `(tokens_input / 1_000_000) * preco_input + (tokens_output / 1_000_000) * preco_output`, usando a tabela oficial do provedor no momento do cálculo (não travar um número aqui — conferir em anthropic.com/pricing se for Claude, ou o provedor usado). Se estiver numa assinatura fixa (ex: Claude Pro/Max) em vez de pagar por token, o cálculo continua sendo feito — hipotético, do mesmo jeito que free tier (seção 5 de `INSTRUCOES-TRABALHO.md`), usando a tabela de preço por token do modelo mesmo assim.
>
> Uma linha por tarefa de `SDD/tasks.md` (branch `main`, cada tarefa = uma chamada de IA), mais a Tentativa 1 (contexto mínimo, branch `experimento/contexto-minimo`) e o teste complementar opcional — todos de `teste-curadoria-contexto.md`. A Fase 0 (linha 0) é a própria sessão de estruturação do SDD, detalhada em `SDD/estruturacao_workspace.md`. Preencher conforme as chamadas acontecem — não reconstruir depois.

| # | Chamada | Branch | Ferramenta/Modelo | Tokens in | Tokens out | Custo (R$/US$) | Print |
|---|---|---|---|---|---|---|---|
| 0a | Fase 0 — estruturação do SDD, ver `relatorios/estruturacao_workspace.md` | — | Claude Code — sonnet-5 (109 chamadas) | 14.945.844 (218 frescos + 330.690 cache criado + 14.614.936 cache lido) | 133.862 | ≤ US$ 7,62 acumulado no checkpoint (via `/cost`) | ⬜ |
| 0b | Fase 0b — ferramental `.claude/`, ver `relatorios/estruturacao_claude.md` | — | Claude Code — opus-5 (37 chamadas) | 7.118.871 (74 frescos + 216.381 cache criado + 6.902.416 cache lido) | 38.976 | +US$ 7,08 no delta Opus → **US$ 14,70 acumulado** | ⬜ |
| 1 | Tarefa 1 — setup do projeto |  main  | Claude Code — sonnet-5 (15 chamadas) | 923.705 (30 frescos + 120.211 cache criado + 803.464 cache lido) | 13.394 | US$ 1,98 pela fórmula (in $2,00/1M + out $10,00/1M, preço promo Sonnet 5 até 2026-08-31) — **conferir com `/cost` antes do print, cache costuma baixar esse número** |  ⬜ |
| 2 | Tarefa 2 — backend completo |  main  | Claude Code — sonnet-5 (delta desde a Tarefa 1, 17 chamadas) | 1.984.088 (delta; acumulado da sessão: 2.907.793) | 11.957 (delta; acumulado: 25.351) | US$ 4,09 pela fórmula (delta) — **conferir com `/cost`** | ⬜ |
| 3 | Tarefa 3 — frontend completo (+ validação local) |  main  | Claude Code — sonnet-5 (delta desde a Tarefa 2, 8 chamadas) | 1.140.362 (delta; acumulado da sessão: 4.048.155) | 13.569 (delta; acumulado: 38.920) | US$ 2,42 pela fórmula (delta) — **conferir com `/cost`** | ⬜ |
| 4 | Tarefa 4 — revisão final |  main  | Claude Code — sonnet-5 (delta desde a Tarefa 3, 6 chamadas) | 947.022 (delta; acumulado da sessão: 4.995.177) | 7.518 (delta; acumulado: 46.438) | US$ 1,97 pela fórmula (delta) — **conferir com `/cost`** | ⬜ |
| 5 | Tentativa 1 — contexto mínimo | `experimento/contexto-minimo` |  |  |  |  |  |
| 6 | complementar (opcional) — arquivo inteiro |  —  |  |  |  |  |  |
| 7 | complementar (opcional) — trecho curado |  —  |  |  |  |  |  |

**Total de tokens in:** _preencher_
**Total de tokens out:** _preencher_
**Custo total da sessão:** _preencher_

Se alguma chamada usar free tier (ex: Google AI Studio), calcular o custo hipotético como se fosse pago e marcar isso na linha.

Pra preencher os números, use a skill `custo-sessao` (`python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py --rotulo "Tarefa N — ..."`). Ela deduplica por `message.id` — somar linha a linha do transcript conta o mesmo consumo várias vezes e infla o total em ~40%.
