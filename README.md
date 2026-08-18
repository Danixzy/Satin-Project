# Gestão de Cartas — Trabalho Prático 1 (Tecnologias Emergentes)

> Esqueleto pronto pra preencher na ordem exigida por `INSTRUCOES-TRABALHO.md` seção 8. Todo item marcado precisa de print — sem print não conta como evidência.

## 1. O que o projeto faz

Feature isolada da Escola de TI (opção "feature pequena e isolada", ver `INSTRUCOES-TRABALHO.md` seção 2): uma página de gestão de cartas de colecionáveis — listar, criar, editar e excluir. Escopo completo em `SDD/spec.md`. Não integra com o sistema real do app (`user-stories.md`); é um protótipo full-stack (React + Node + Postgres) implementado com apoio de IA.

## 2. System prompt usado (completo)

_Colar aqui o bloco de `SDD/system-prompt.md` → "Texto do system prompt", exatamente como usado (via `CLAUDE.md`)._

## 3. Técnica aplicada

**Few-shot.** Justificativa completa em `SDD/system-prompt.md`. _(TODO: print mostrando o padrão do primeiro endpoint/componente sendo reaproveitado nos seguintes.)_

## 4. Teste de curadoria de contexto

Procedimento em `SDD/teste-curadoria-contexto.md` — a mesma feature implementada duas vezes, contexto mínimo vs. pacote completo.

- **Tentativa 1 (contexto mínimo, branch `experimento/contexto-minimo`):** _TODO — prompt usado + print com contagem de tokens + o que a IA inventou (campos, rotas, estrutura) sem acesso à spec._
- **Tentativa 2 (pacote completo, branch `main`):** _TODO — tokens somados das Tarefas 1-3 (`SDD/log-chamadas.md`)._
- **Comparação:** _TODO — tokens de uma vs. outra, e onde a Tentativa 1 divergiu do spec real._

## 5. Tabela de chamadas

Inclui a Fase 0 (estruturação do próprio SDD — spec, plan, tasks, prompts — detalhada em `relatorios/estruturacao_workspace.md`) além das Tarefas 1-3 de implementação.

_TODO — colar a tabela preenchida de `SDD/log-chamadas.md` (tokens in/out, custo por chamada, custo total da sessão)._

## 6. Print/export do dashboard ou log da ferramenta

_TODO — print do `/cost` do Claude Code (ou transcript de `~/.claude/projects/`), comprovando os números da tabela acima._

## 7. URL publicada

_TODO — link do app `frontend` no CapRover, já testado e acessível (backend e frontend são dois deploys separados; a URL que conta aqui é a do frontend, que consome o backend por trás)._

## 8. Alunos participantes

_TODO — nome e RA de cada integrante do grupo._

---

## Apêndice — documentação SDD do projeto

- [`relatorios/estruturacao_workspace.md`](relatorios/estruturacao_workspace.md) — Fase 0: como o próprio SDD foi construído (tokens/custo dessa fase)
- [`relatorios/estruturacao_claude.md`](relatorios/estruturacao_claude.md) — Fase 0b: ferramental `.claude/` + comparação de custo Opus vs. Sonnet
- [`SDD/spec.md`](SDD/spec.md) — o que a feature faz (fonte de verdade)
- [`SDD/plan.md`](SDD/plan.md) — arquitetura, contrato de API, schema, deploy
- [`SDD/tasks.md`](SDD/tasks.md) — checklist de implementação (3 tarefas, branch `main`)
- [`SDD/prompts/`](SDD/prompts/) — um prompt pronto por tarefa, contexto já curado
- [`.claude/template/task-prompt.template.md`](.claude/template/task-prompt.template.md) — modelo pra criar novos prompts de tarefa
- [`.claude/agents/revisor-sdd.md`](.claude/agents/revisor-sdd.md) — subagente revisor (confere código contra spec/plan)
- [`.claude/skills/custo-sessao/`](.claude/skills/custo-sessao/) — skill que extrai tokens/custo do transcript
- [`SDD/system-prompt.md`](SDD/system-prompt.md) — system prompt + justificativa da técnica
- [`SDD/teste-curadoria-contexto.md`](SDD/teste-curadoria-contexto.md) — procedimento do requisito 3
- [`SDD/log-chamadas.md`](SDD/log-chamadas.md) — log de tokens/custo por chamada
