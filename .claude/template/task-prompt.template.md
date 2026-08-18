# Tarefa [N] — [Título curto]

## Contexto necessário desta task

> Só o trecho de `SDD/spec.md`/`SDD/plan.md` que esta tarefa precisa — nunca o arquivo inteiro. Isso é o princípio de curadoria de contexto (requisito 3 do trabalho): o resto da spec é ruído pra essa tarefa específica, e cada arquivo destes vira a "versão curada" na comparação de tokens.

[colar aqui só as linhas/seções relevantes]

## O que fazer

[instruções objetivas, correspondentes à tarefa em `SDD/tasks.md`]

## Arquivos esperados

- `[caminho do arquivo criado/editado]`

## Como usar este arquivo

1. Cole o conteúdo deste arquivo no chat como contexto/task.
2. Cole em seguida o system prompt de `SDD/system-prompt.md` (ou confirme que o `CLAUDE.md` da raiz já está carregado na sessão).
3. Rode. Revise o resultado antes de seguir pra próxima tarefa.

## Depois de rodar

1. Rodar o subagente `revisor-sdd` pra conferir o código contra `spec.md`/`plan.md`.
2. Marcar a tarefa como concluída em `SDD/tasks.md`.
3. Coletar tokens/custo com a skill `custo-sessao` e registrar na linha correspondente de `SDD/log-chamadas.md`.
4. Print da chamada (prompt + resposta) pra evidência do README.
