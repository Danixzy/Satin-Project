# System Prompt — Implementação da feature de Cartas

> Definido e documentado **antes** de começar a construir, por exigência do requisito 1 de `INSTRUCOES-TRABALHO.md`. Usado em toda chamada de IA que gerar código de `SDD/tasks.md`, colado como instrução de sistema (no Claude Code, via `CLAUDE.md` na raiz do projeto).

## Texto do system prompt

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

## Por que esse system prompt

- **Regras 1 e 3** amarram a IA à spec e ao plan como fonte de verdade — sem isso, uma LLM sem contexto do projeto tende a inventar decisão errada ou gerar algo desconectado (é literalmente o risco que `INSTRUCOES-TRABALHO.md` seção 2 avisa sobre features isoladas).
- **Regra 2** faz cada task virar uma chamada isolada e rastreável — que é exatamente o que preenche uma linha de `log-chamadas.md` (requisito 4, cálculo de custo por chamada).

## Técnica de prompt engineering aplicada: Few-shot

A **regra 4** é a técnica escolhida (requisito 2 de `INSTRUCOES-TRABALHO.md`): depois que a primeira rota de API (T5) e o primeiro componente de tela (T12) existem no repositório, eles funcionam como **exemplo (shot)** que as tasks seguintes devem imitar em estrutura, nomenclatura e tratamento de erro.

**Por que few-shot e não chain-of-thought aqui:** a feature é um CRUD de 4 operações repetidas em 2 camadas (API e UI) — o "raciocínio" necessário pra cada task é trivial (não tem lógica de negócio complexa que se beneficie de pensar passo a passo). O risco real é **inconsistência de estilo** entre os 4 endpoints e as 2 telas geradas em chamadas separadas. Ancorar cada chamada nova no exemplo já implementado resolve exatamente esse risco, sem pagar o custo de tokens extra de um prompt de chain-of-thought que essa lógica simples não justifica.

## Como usar

1. Este texto vai para `CLAUDE.md` na raiz do repositório antes da primeira chamada de implementação (T1).
2. Print do `CLAUDE.md` + de uma chamada seguindo essas regras = evidência do requisito 1 no README.
