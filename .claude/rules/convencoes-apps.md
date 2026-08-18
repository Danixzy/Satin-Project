---
paths:
  - "apps/**/*.{js,ts,tsx,jsx,sql,json}"
---

# Convenções do código (apps/backend e apps/frontend)

Carregado só quando algum arquivo de `apps/` está em jogo. Regras de workflow (uma tarefa por vez, o que é fonte de verdade) ficam no `CLAUDE.md`; aqui é só como o código deve sair.

## Fonte de verdade

`SDD/spec.md` e `SDD/plan.md` definem campos, rotas e telas. Não crie campo, endpoint, tabela ou tela que não esteja lá — nem "só pra ficar completo".

Campos da carta: `nome`, `numero`, `colecao`, `imagem_url`. `numero` é texto (aceita "025/102"), nunca inteiro.

## Consistência entre arquivos da mesma camada

Do **segundo** endpoint e do **segundo** componente em diante, copie o padrão do primeiro daquela camada — mesma estrutura, mesma nomenclatura, mesmo tratamento de erro. Não varie estilo entre arquivos do mesmo tipo. (Essa consistência é a técnica de prompt avaliada no trabalho, não é preferência estética.)

Referências: `apps/backend/src/routes/cartas.js` (`GET /api/cartas` é o exemplo) e `apps/frontend/src/components/CardItem.tsx`.

## Backend

- `pg` direto, sem ORM. Sem camada de service/repository — as queries ficam no arquivo de rota.
- `DATABASE_URL` e `PORT` sempre de `process.env`, nunca hardcoded.
- `cors()` habilitado: o frontend roda em outra origem.
- Só API. Este processo não serve arquivo estático do frontend.

## Frontend

- Toda chamada de API usa `import.meta.env.VITE_API_URL` como prefixo. Caminho relativo (`fetch('/api/cartas')`) quebra em produção.
- `FormularioCarta` atende criação e edição no mesmo componente; o modo vem da presença do param `:id`.

## Estilo

- Sem comentário explicando o óbvio. Comente só o não-óbvio (um formato estranho, uma decisão contraintuitiva).
- Prefira código direto a abstração. É um CRUD de 4 operações.
- Nada de autenticação, permissões, upload de arquivo, paginação, busca, filtros, ordenação ou teste automatizado — fora de escopo por decisão registrada em `SDD/spec.md` seção 3.
