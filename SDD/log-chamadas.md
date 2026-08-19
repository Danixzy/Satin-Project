# Log de Chamadas de IA

> Requisito 4 de `INSTRUCOES-TRABALHO.md`: custo por chamada = `(tokens_input / 1_000_000) * preco_input + (tokens_output / 1_000_000) * preco_output`, usando a tabela oficial do provedor no momento do cálculo (não travar um número aqui — conferir em anthropic.com/pricing se for Claude, ou o provedor usado). Se estiver numa assinatura fixa (ex: Claude Pro/Max) em vez de pagar por token, o cálculo continua sendo feito — hipotético, do mesmo jeito que free tier (seção 5 de `INSTRUCOES-TRABALHO.md`), usando a tabela de preço por token do modelo mesmo assim.
>
> Uma linha por tarefa de `SDD/tasks.md` (branch `contexto`, cada tarefa = uma chamada de IA), mais a Tentativa 1 (contexto mínimo, branch `sem-contexto`) e o teste complementar opcional — todos de `teste-curadoria-contexto.md`. Preencher conforme as chamadas acontecem — não reconstruir depois.

| # | Chamada | Branch | Ferramenta/Modelo | Tokens in | Tokens out | Custo (R$/US$) | Print |
|---|---|---|---|---|---|---|---|
| 1 | Tarefa 1 — setup do projeto | `contexto` | Claude Code — sonnet-5 (15 chamadas) | 923.705 (30 frescos + 120.211 cache criado + 803.464 cache lido) | 13.394 | US$ 1,98 pela fórmula (in $2,00/1M + out $10,00/1M) | ⬜ |
| 2 | Tarefa 2 — backend completo | `contexto` | Claude Code — sonnet-5 (delta desde a Tarefa 1, 17 chamadas) | 1.984.088 (delta; acumulado da sessão: 2.907.793) | 11.957 (delta; acumulado: 25.351) | US$ 4,09 pela fórmula (delta) | ⬜ |
| 3 | Tarefa 3 — frontend completo (+ validação local) | `contexto` | Claude Code — sonnet-5 (delta desde a Tarefa 2, 8 chamadas) | 1.140.362 (delta; acumulado da sessão: 4.048.155) | 13.569 (delta; acumulado: 38.920) | US$ 2,42 pela fórmula (delta) | ⬜ |
| 4 | Tarefa 4 — revisão final | `contexto` | Claude Code — sonnet-5 (delta desde a Tarefa 3, 6 chamadas) | 947.022 (delta; acumulado da sessão: 4.995.177) | 7.518 (delta; acumulado: 46.438) | US$ 1,97 pela fórmula (delta), **US$ 9,70 real via `/cost`** (sessão inteira Tarefas 1-4) | ✅ `relatorios/custo_implementacao_contexto.png` |
| 5 | Tentativa 1 — contexto mínimo (spec colada crua, sem projeto real) | `sem-contexto` | Claude Code — sonnet-5 (75 chamadas) | 5.348.675 (150 frescos + 159.032 cache criado + 5.189.493 cache lido) | 37.845 | US$ 11,08 pela fórmula, **US$ 2,28 real via `/cost`** | ✅ `relatorios/custo_implementacao_sem_contexto.png` |
| 6 | complementar (opcional) — arquivo inteiro | — | não executado | — | — | — | ⬜ |
| 7 | complementar (opcional) — trecho curado | — | não executado | — | — | — | ⬜ |

**Total de tokens in:** 10.343.852
**Total de tokens out:** 84.283
**Custo total da sessão:** ≈ US$ 11,98 (US$ 9,70 Tarefas 1-4 + US$ 2,28 Tentativa 1, ambos reais via `/cost`)

Se alguma chamada usar free tier (ex: Google AI Studio), calcular o custo hipotético como se fosse pago e marcar isso na linha.

Pra preencher os números, use a skill `custo-sessao` (`python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py --rotulo "Tarefa N — ..."`). Ela deduplica por `message.id` — somar linha a linha do transcript conta o mesmo consumo várias vezes e infla o total em ~40%.
