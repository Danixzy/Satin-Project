# Tarefa 3 — Frontend completo (listagem, criar, editar, excluir)

## Contexto necessário desta task

Fluxo de UI completo (de `spec.md`, seção 5):

> **Listagem:** grade de cards, um por carta. Botão "Criar Carta" fixo no canto superior direito. Estado vazio: mensagem simples + o mesmo botão. Clicar num card abre um popover com "Editar" e "Excluir". Editar navega pro formulário em modo edição. Excluir pede confirmação ("Excluir [nome]?"); confirmando, chama a API e remove o card sem recarregar a página.
>
> **Formulário (criar e editar, mesmo componente):** rota `/cartas/nova` com campos vazios; rota `/cartas/:id/editar` busca a carta e pré-preenche. Campos: nome, número, coleção (texto, obrigatórios), imagem URL (texto, opcional). Salvar faz `POST` (criação) ou `PUT` (edição) e redireciona pra `/`.

Rotas (de `plan.md`, seção 5):

| Rota | Componente |
|---|---|
| `/` | `ListaCartas` |
| `/cartas/nova` | `FormularioCarta` |
| `/cartas/:id/editar` | `FormularioCarta` |

Contrato de API completo (de `plan.md`, seção 4) — os 5 endpoints já existem no backend (Tarefa 2), rodando em processo/origem separada do frontend.

**Base da API** (de `plan.md`, seção 5): o frontend não é servido pelo mesmo processo do backend — todas as chamadas usam `import.meta.env.VITE_API_URL` como prefixo (ex: `${import.meta.env.VITE_API_URL}/api/cartas`), nunca caminho relativo tipo `/api/cartas` sozinho. `apps/frontend/.env.example` já tem `VITE_API_URL=http://localhost:3000` (Tarefa 1).

## O que fazer

1. Criar `apps/frontend/src/api/cartas.ts`: uma função por endpoint (`listarCartas`, `buscarCarta`, `criarCarta`, `atualizarCarta`, `excluirCarta`) e o tipo `Carta`, todas prefixando a URL com `import.meta.env.VITE_API_URL`.
2. Criar `apps/frontend/src/components/CardItem.tsx`: recebe uma `Carta`, mostra imagem/placeholder + nome + número + coleção; ao clicar, abre popover com Editar/Excluir. Este é o primeiro componente — vira o padrão de estrutura que `ListaCartas`/`FormularioCarta` devem seguir.
3. Criar `apps/frontend/src/pages/ListaCartas.tsx`: busca `listarCartas()` no mount, renderiza a grade de `CardItem`, botão "Criar Carta" no canto superior direito, trata estado vazio. Implementa a exclusão de verdade: confirmação + `excluirCarta(id)` + remove do estado local no sucesso.
4. Criar `apps/frontend/src/pages/FormularioCarta.tsx`: detecta modo criação/edição pelo `:id` da rota (`useParams`), pré-preenche via `buscarCarta` quando em edição, valida campos obrigatórios no cliente, salva via `criarCarta`/`atualizarCarta` e redireciona pra `/` no sucesso.
5. Configurar `apps/frontend/src/App.tsx` com as 3 rotas da tabela acima via `react-router-dom`.
6. Estilizar em `apps/frontend/src/index.css` (CSS puro — sem adicionar biblioteca de UI, isso não está em `plan.md` seção 1). Não é só "fazer funcionar", é fazer parecer um produto de verdade:
   - Paleta consistente via CSS custom properties em `:root` (fundo, superfície, texto, cor primária, cor de perigo pra excluir).
   - Cards da listagem com sombra sutil, cantos arredondados, leve elevação no hover (`transform` + `box-shadow`), área de imagem com `object-fit: cover` e placeholder visualmente distinto quando `imagem_url` for vazio.
   - Popover de Editar/Excluir como um menu flutuante de verdade (posicionado com `position: absolute`, sombra, bordas arredondadas), não uma lista crua — "Excluir" com cor de perigo pra se diferenciar de "Editar".
   - Botão "Criar Carta" fixo no canto superior direito com destaque visual (cor primária, formato de pill/botão, sombra) — ele é o CTA principal da tela.
   - Formulário como um cartão centralizado (não os campos soltos na página), inputs com padding generoso e estado de foco visível, botão de salvar com a mesma cor primária dos outros CTAs.
   - Não adicionar elementos de UI que não estão no fluxo do `spec.md` (ex: botão de cancelar, breadcrumbs) — o objetivo é deixar bonito o que já existe, não adicionar fluxo novo.

## Arquivos esperados

- `apps/frontend/src/api/cartas.ts`
- `apps/frontend/src/components/CardItem.tsx`
- `apps/frontend/src/pages/ListaCartas.tsx`
- `apps/frontend/src/pages/FormularioCarta.tsx`
- `apps/frontend/src/App.tsx`
- `apps/frontend/src/index.css` (estilo de toda a feature)

## Como usar este arquivo

1. Cole o conteúdo deste arquivo no chat como contexto/task.
2. Cole em seguida o system prompt de `SDD/system-prompt.md` (ou confirme que o `CLAUDE.md` da raiz já está carregado na sessão).
3. Rode. Revise o resultado antes de seguir pra próxima tarefa.

## Depois de rodar

1. Marcar a Tarefa 3 como concluída em `SDD/tasks.md`.
2. Registrar tokens de entrada/saída e custo na linha 3 de `SDD/log-chamadas.md`.
3. Print da chamada. Com isso o fluxo completo da feature (`spec.md` seção 6) deve estar implementado — copie `apps/backend/.env.example` e `apps/frontend/.env.example` pra `.env` de cada um, suba um Postgres local, rode `apps/backend` (`npm run dev`/equivalente) e `apps/frontend` (`npm run dev`) juntos, e valide os critérios de aceite direto no navegador. O deploy no CapRover (dois apps separados) fica por sua conta, fora deste fluxo de tasks (ver `plan.md` seção 6 como referência quando for fazer).
