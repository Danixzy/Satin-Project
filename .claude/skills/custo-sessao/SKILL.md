---
name: custo-sessao
description: Extrai tokens de entrada/saída e custo das sessões do Claude Code deste projeto, a partir do transcript local, e monta a linha pronta pra SDD/log-chamadas.md. Use ao terminar uma tarefa do SDD, ao fechar o teste de curadoria de contexto, ou sempre que precisar dos números de token/custo pro README do trabalho.
---

# Coletar tokens e custo de uma sessão

Serve o requisito 4 de `SDD/docs/INSTRUCOES-TRABALHO.md` (custo estimado por chamada) e a seção 5 (de onde tirar os números no Claude Code).

## Uso

O script lê os transcripts em `~/.claude/projects/<projeto>/*.jsonl` — o caminho que o próprio enunciado indica pra Claude Code.

```bash
# sessão mais recente deste projeto
python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py

# ver quais sessões existem
python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py --listar

# uma sessão específica, ou todas somadas
python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py --sessao <id>
python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py --todas

# recortar por tempo (útil pra isolar UMA tarefa dentro de uma sessão longa)
python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py --desde 2026-08-18T04:00:00Z --ate 2026-08-18T04:30:00Z

# calcular o custo pela fórmula do trabalho (preços em US$ por 1M tokens)
python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py --preco-in 3 --preco-out 15

# já rotulando a linha de log
python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py --rotulo "Tarefa 2 — backend completo"
```

Saída: totais de entrada/saída, quebra por modelo quando há mais de um, e uma linha markdown pronta pra colar em `SDD/log-chamadas.md`.

## Três armadilhas que mudam o número (leia antes de reportar)

**1. Uma resposta da API vira várias linhas no JSONL.** Cada bloco de conteúdo (thinking, cada tool_use) é gravado como uma linha própria, todas repetindo o *mesmo* objeto `usage`. Somar linha a linha conta em dobro — numa sessão real isso inflou a contagem em ~40%. O script deduplica por `message.id`; qualquer contagem manual precisa fazer o mesmo.

**2. A maior parte da "entrada" é cache, e cache não custa preço cheio.** O Claude Code reenvia o contexto acumulado a cada turno, então `cache_read_input_tokens` domina o total (frequentemente >95%). Leitura de cache custa uma fração do token novo e escrita de cache custa mais que ele — por isso aplicar um preço único sobre a entrada total **não bate** com o `/cost`. O script mostra os três componentes separados justamente pra isso ficar visível.

**3. Modelos diferentes têm preços diferentes.** Se a sessão trocou de modelo no meio (ex: Sonnet → Opus), calcule por modelo e some — não aplique um preço só no agregado. O script já quebra por modelo quando detecta mais de um.

## Fluxo recomendado

1. Rode o script com `--rotulo` da tarefa que acabou.
2. Pegue o preço vigente do modelo em `anthropic.com/pricing` (o script não embute tabela de preço de propósito — preço muda, e número errado no README custa nota no item "custo calculado certo").
3. Rode de novo com `--preco-in`/`--preco-out` pra ter o valor pela fórmula do trabalho.
4. Compare com o `/cost` do CLI. **Divergiu? O `/cost` é a fonte mais confiável** — use ele como número oficial e explique a diferença pelo efeito de cache (isso rende ponto na apresentação, é exatamente o tópico "economia de tokens").
5. Cole a linha em `SDD/log-chamadas.md` e capture o print do `/cost` como evidência.

## Importante

Os números crescem enquanto a sessão continua aberta. Re-extraia no fim, antes de fechar o README — não deixe no arquivo um número medido no meio do caminho.
