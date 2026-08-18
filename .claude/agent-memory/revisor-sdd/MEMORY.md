# Memória — revisor-sdd

Índice das invariantes deste projeto. Uma linha por fato. Detalhe longo vai em arquivo de tópico separado.

## Invariantes confirmadas (fonte: SDD/spec.md, SDD/plan.md)

- Entidade `carta` tem exatamente 4 campos editáveis: `nome`, `numero`, `colecao`, `imagem_url` (+ `id` e `created_at` gerados pelo banco).
- `numero` é **texto**, não inteiro — aceita formato "025/102", com barra e zeros à esquerda.
- API: 5 endpoints sob `/api/cartas` (GET lista, GET :id, POST, PUT :id, DELETE :id). Nada além disso.
- Telas: 3 rotas (`/`, `/cartas/nova`, `/cartas/:id/editar`). `FormularioCarta` é um componente só, modo definido pela presença do param `:id`.
- Backend e frontend são apps separados (`apps/backend`, `apps/frontend`) em um repositório único: exige CORS no backend e `VITE_API_URL` no frontend.
- Sem ORM, sem camada de service/repository — decisão explícita de `plan.md` seção 1.

## Divergências recorrentes observadas

_(preencher conforme as revisões acontecerem — ex: campos que a IA tende a inventar, padrões que ela quebra da segunda ocorrência em diante)_
