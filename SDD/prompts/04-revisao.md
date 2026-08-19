# Tarefa 4 — Revisão final (backend + frontend)

## Contexto necessário desta task

Esta tarefa não gera código novo — ela audita o que as Tarefas 1, 2 e 3 já produziram (`apps/backend/` e `apps/frontend/` completos) contra as duas fontes de verdade da feature:

- `SDD/spec.md` — o que a feature deve fazer, campos da entidade Carta (seção 4), fluxo de UI (seção 5) e, principalmente, os **critérios de aceite** (seção 6, 8 itens em checklist).
- `SDD/plan.md` — stack, schema do banco, contrato de API (5 endpoints), estrutura de pastas.

As tarefas anteriores já rodaram o subagente `revisor-sdd` uma vez ao final de cada uma (`SDD/tasks.md`, "Ao fechar cada tarefa"), mas cada rodada só via o diff daquela tarefa isolada. Esta é a passada final, vendo backend e frontend **juntos e completos**, capaz de flagar problema de integração entre as camadas (ex: campo que o backend expõe e o frontend não usa, ou vice-versa) e, principalmente, **verificar se algum critério de aceite de `spec.md` seção 6 ficou sem cobertura** no código — não só divergência do que foi escrito, mas lacuna do que não foi escrito.

## O que fazer

1. Rodar o subagente `revisor-sdd` (`.claude/agents/revisor-sdd.md`) apontando para todo o código já implementado em `apps/backend/` e `apps/frontend/`, não apenas os arquivos de uma tarefa.
2. Além do checklist padrão do agente (campos inventados, rotas fora do contrato, escopo proibido, consistência de padrão entre arquivos da mesma camada, `VITE_API_URL`, CORS), pedir explicitamente que ele percorra os 8 itens de `spec.md` seção 6 um a um e aponte, pra cada item, se o código cobre ou não — sem rodar nada (o agente só lê código), é uma checagem estática de que o fluxo necessário pra cada critério existe (ex: o handler de exclusão pede confirmação antes de chamar a API; a listagem busca os dados no mount; etc).
3. Revisar o relatório do agente. Ele não corrige nada sozinho — cada achado é uma decisão sua: ajustar o código, ou registrar como aceitável e seguir.

## Saída esperada

Não há arquivo de código esperado desta tarefa — o resultado é o relatório do `revisor-sdd`, agrupado por severidade (diverge da fonte de verdade / fora de escopo / inconsistência de padrão), mais a cobertura item a item dos critérios de aceite.

## Como usar este arquivo

1. Cole o conteúdo deste arquivo no chat como contexto/task.
2. Peça pra rodar o subagente `revisor-sdd` sobre `apps/backend/` e `apps/frontend/` completos, incluindo a checagem dos critérios de aceite descrita acima.
3. Revise os achados. Se houver divergência real, decida se corrige agora (fora do fluxo de tasks de IA, ou como ajuste manual pontual) ou se registra e segue pro deploy.

## Depois de rodar

1. Marcar a Tarefa 4 como concluída em `SDD/tasks.md`.
2. Registrar tokens de entrada/saída e custo na linha 4 de `SDD/log-chamadas.md`.
3. Print da chamada e do relatório do `revisor-sdd` — vira evidência da revisão, junto com o teste de curadoria de contexto.
