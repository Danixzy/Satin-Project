# Estruturação do Workspace (SDD)

> Fase 0 do trabalho: antes de qualquer código, esta foi a conversa (nesta mesma sessão de Claude Code) usada pra desenhar a documentação SDD que guia a implementação real (Tarefas 1-3 em `SDD/tasks.md`). Ela própria já é uma chamada de IA que consumiu tokens de verdade — por isso entra no log de evidências, não só o código gerado depois.

## O que o trabalho pediu, atendido nesta fase

De `SDD/docs/INSTRUCOES-TRABALHO.md`:

- **Seção 3** — *"Planeje o que vai capturar antes da primeira chamada de IA."* Decidido aqui: qual o system prompt, qual técnica de prompt engineering, onde logar cada chamada (`SDD/log-chamadas.md`), qual ferramenta gera os números de tokens (Claude Code — `/cost` ou transcript local).
- **Requisito 1** — system prompt explícito, definido e documentado *antes* de começar a construir: saiu desta fase (`SDD/system-prompt.md` + `CLAUDE.md`).
- **Seção 2** (opção Escola de TI) — decidir a arquitetura da feature isolada com contexto real (spec, plan, contrato de API, schema), pra não deixar a IA inventar decisão desconectada nas Tarefas 1-3.

## O que foi feito nesta fase

- `SDD/spec.md` — escopo da feature de gestão de cartas (fonte de verdade)
- `SDD/plan.md` — arquitetura: stack, estrutura de pastas (`apps/backend`, `apps/frontend`, um repositório só), contrato de API, schema do banco, estratégia de deploy (dois apps CapRover via CLI) e de branches (múltiplas tentativas)
- `SDD/tasks.md` — checklist de 3 tarefas de implementação (branch `main`)
- `SDD/system-prompt.md` + `CLAUDE.md` — system prompt usado nas Tarefas 1-3 + justificativa da técnica (few-shot)
- `SDD/prompts/01-setup.md`, `02-backend-api.md`, `03-frontend.md` — prompts prontos por tarefa, contexto já curado (só o trecho de spec/plan que cada uma precisa)
- `.claude/template/task-prompt.template.md` — modelo reaproveitável pra novos prompts de tarefa
- `SDD/teste-curadoria-contexto.md` — desenho do experimento do requisito 3 (contexto mínimo vs. pacote completo)
- `SDD/log-chamadas.md` — template do log de tokens/custo
- `README.md` — esqueleto da entrega final, já na ordem exigida pela seção 8

Ferramental do Claude Code configurado pra sustentar esse fluxo:

- `.claude/agents/revisor-sdd.md` — subagente que confere o código gerado contra `spec.md`/`plan.md` e aponta campo/rota/tela inventados, com memória persistente em `.claude/agent-memory/revisor-sdd/`
- `.claude/rules/convencoes-apps.md` — convenções de código carregadas só quando algum arquivo de `apps/` está em jogo (path-scoped)
- `.claude/skills/custo-sessao/` — skill que extrai tokens/custo do transcript e monta a linha de `log-chamadas.md`

## Consumo de tokens desta fase

Extraído direto do transcript local da sessão (`~/.claude/projects/.../1223a53b-....jsonl`), o mesmo método que `INSTRUCOES-TRABALHO.md` seção 5 sugere pro Claude Code (`usage.input_tokens`/`output_tokens` por mensagem).

| Métrica | Valor |
|---|---|
| Ferramenta | Claude Code |
| Modelos | `claude-sonnet-5` (109 chamadas) e `claude-opus-5` (15 chamadas — modelo trocado no meio da sessão) |
| Período | 2026-08-18, 03:46 → 05:01 (UTC) |
| Chamadas de API (respostas únicas do modelo) | 124 |
| Tokens de entrada "frescos" (sem cache) | 248 |
| Tokens de cache **criados** (`cache_creation_input_tokens`) | 520.271 |
| Tokens de cache **lidos** (`cache_read_input_tokens`) | 17.054.215 |
| Tokens de entrada, total (fresco + cache criado + cache lido) | 17.574.734 |
| Tokens de saída (`output_tokens`) | 152.322 |
| **Custo desta fase (via `/cost` do Claude Code)** | **US$ 7,62** medido em 2026-08-18 — parcial, re-conferir e printar no fim |

> Medição parcial: a sessão ainda estava aberta. Re-extrair antes de fechar o README, com
> `python3 .claude/skills/custo-sessao/scripts/extrair_tokens.py` (skill `custo-sessao`).

### Correção de método (vale contar na apresentação)

A primeira contagem manual desta fase deu **167 chamadas e 22,5M tokens de entrada** — número **errado, inflado em ~40%**. Motivo: no transcript, uma única resposta da API é gravada em **várias linhas** (uma por bloco de conteúdo — o raciocínio, cada chamada de ferramenta), e todas repetem o *mesmo* objeto `usage`. Somar linha a linha conta o mesmo consumo várias vezes. O número correto sai deduplicando por `message.id`, que é o que o script da skill `custo-sessao` faz.

Como o item de maior peso da rubrica (0,6) é justamente "tokens in/out corretos, evidências batendo com o que está escrito", esse detalhe é o tipo de erro que derruba nota sem ninguém perceber — e explicar que vocês acharam e corrigiram é um ótimo material de apresentação.

## Por que a entrada é tão alta sem o custo ser proporcional

O Claude Code reenvia o contexto acumulado a cada turno. Dos ~17,6M tokens de entrada, ~17,1M (97%) foram **lidos do cache** (prompt caching), cobrado numa fração do preço de um token novo; só ~520K viraram cache pela primeira vez e apenas 248 nunca passaram por cache. É isso que separa o "total bruto de tokens" do custo real — exemplo direto do tópico "janela de contexto / economia de tokens" da disciplina.

## Cálculo pela fórmula do trabalho — conferir antes de fechar o README

A fórmula do enunciado (`custo = (tokens_input / 1M) * preco_input + (tokens_output / 1M) * preco_output`) aplica um preço único sobre toda a entrada. Aqui isso **não bate** com o `/cost`, por dois motivos somados: (1) leitura de cache custa bem menos que token novo, e escrita de cache custa mais; (2) a sessão usou dois modelos, com preços diferentes — o certo é calcular por modelo e somar.

Antes de entregar: pegar o preço vigente de cada modelo em `anthropic.com/pricing`, recalcular, e usar o valor do `/cost` como número oficial (fonte mais confiável), explicando a diferença pelo efeito de cache. Não travem número sem conferir.

## Evidência a capturar

- [ ] Print do `/cost` do Claude Code mostrando o custo desta fase (ou o valor atualizado no momento da entrega).
- [ ] Referenciar este arquivo no README como a "Fase 0" da entrega, antes da tabela de chamadas das Tarefas 1-3.
