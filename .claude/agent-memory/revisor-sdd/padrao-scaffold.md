---
name: padrao-scaffold
description: Checklist de revisão pra tasks de setup/scaffold de projeto (antes de código de negócio existir), específico do projeto satin_workspace
metadata:
  type: project
---

A Tarefa 1 (setup) do fluxo de `SDD/tasks.md` deste projeto só cria scaffold —
package.json, init.sql, .env.example, projeto Vite gerado — sem rotas de API nem
componentes de tela ainda. Isso é esperado, não é achado de divergência.

**Por que:** a primeira revisão desse tipo (2026-08-18) quase reportou como
"faltando" a ausência de `db.js`, `server.js`, `routes/cartas.js`,
`CardItem.tsx`, `ListaCartas.tsx`, `FormularioCarta.tsx` — mas isso é
intencional, fica pras Tarefas 2/3 (ver `CLAUDE.md` da raiz, regra 2: uma task
por vez, na ordem de `tasks.md`).

**Como aplicar:** ao revisar uma task de scaffold, confirmar apenas:
schema do `init.sql` bate com `plan.md`; `.env.example` tem as vars certas;
`package.json` não tem dependência extra (ORM, ESLint, libs de teste) além do
que `plan.md` seção 1 e o template Vite react-ts padrão trazem; estrutura de
pastas sem `.git` aninhado. Não cobrar ausência de código de negócio nessa
etapa. O `App.tsx` gerado pelo `create-vite` (boilerplate com contador) é
esperado ficar intacto até a task que implementa as rotas de fato — vale
mencionar como observação não bloqueante, não como erro.

Nota: a ferramenta `Glob` com pattern relativo tipo `apps/backend/**` não
encontrou nada nesse ambiente (path com espaços) — funcionou só passando
`path` absoluto e `pattern: "**"`. Útil lembrar se `Glob` parecer retornar
vazio incorretamente numa próxima revisão.
