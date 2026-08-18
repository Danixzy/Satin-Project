# Teste de Curadoria de Contexto

> Requisito 3 de `INSTRUCOES-TRABALHO.md`, na versão específica que a seção 2 pede pro caminho Escola de TI: *"tentem a mesma feature mais de uma vez, variando a quantidade de contexto fornecido, do mínimo possível até um pacote completo... e comparem resultado e consumo de tokens... Essa comparação alimenta direto o requisito 3, não é trabalho extra."* Ou seja: não é só uma pergunta respondida de duas formas — é a própria feature implementada duas vezes, com contexto diferente, comparando **resultado** (o código gerado diverge do spec?) e **tokens**. Roda isso de verdade e captura print de cada chamada com a contagem de tokens.

## Tentativa 1 — contexto mínimo

Branch separada: `experimento/contexto-minimo` (não mergear na `main` — é só pra comparação).

Prompt usado, **sem colar nenhum arquivo do projeto** (chat novo, sem `CLAUDE.md`/`SDD/spec.md`/`SDD/plan.md` carregados como contexto):

> "Crie uma feature de gestão de cartas de colecionáveis: uma tela lista as cartas cadastradas, com um botão de criar carta no canto superior direito; clicar numa carta mostra opções de editar e excluir; editar reaproveita a tela de criação com os campos preenchidos. Backend em Node/Express com Postgres, frontend em React."

Deixa a IA decidir sozinha: nomes de campos, rotas da API, estrutura de pastas, como separar (ou não) frontend/backend. **Não corrige nem guia** — o objetivo é justamente ver o que ela inventa sem o `plan.md`/`spec.md` como fonte de verdade.

## Tentativa 2 — pacote completo (contexto curado)

É a implementação real do projeto, branch `main`: Tarefas 1-3 (`SDD/prompts/01-setup.md`, `02-backend-api.md`, `03-frontend.md`), guiadas por `SDD/spec.md` + `SDD/plan.md`, com o `CLAUDE.md`/system prompt carregado.

## O que capturar

| | Tentativa 1 (contexto mínimo) | Tentativa 2 (pacote completo) |
|---|---|---|
| Tokens de entrada (total da tentativa) | _preencher_ | _preencher_ (soma das linhas 1-3 de `log-chamadas.md`) |
| Tokens de saída (total da tentativa) | _preencher_ | _preencher_ |
| Nome dos campos da carta que a IA escolheu | _preencher_ | `nome`, `numero`, `colecao`, `imagem_url` (definido em `spec.md`) |
| Rotas de API escolhidas | _preencher_ | `/api/cartas` (`spec.md`/`plan.md`) |
| Fez o fluxo de popover Editar/Excluir ao clicar no card, como pedido? | _preencher_ | sim (guiado pelo spec) |
| Print da(s) chamada(s) | _anexar_ | _anexar_ (já capturados via `log-chamadas.md`) |

## Conclusão esperada (a confirmar rodando de verdade)

A Tentativa 1 deve divergir do spec real em pelo menos alguns pontos (nome de campo diferente, estrutura de pastas diferente, talvez pulando o passo intermediário do popover Editar/Excluir) — isso evidencia exatamente o texto do enunciado: *"uma LLM sem contexto do projeto real tende a inventar decisão errada ou gerar algo desconectado do resto do sistema."* A Tentativa 2, guiada pelo contexto curado, deve bater exatamente com os critérios de aceite de `spec.md` seção 6.

Isso vai direto pro README, seção 4 (`INSTRUCOES-TRABALHO.md` seção 8, item 4).

## Teste complementar rápido (opcional, se sobrar tempo)

Versão minimalista do requisito 3 pra ilustração adicional na apresentação: pega uma pergunta pontual (ex: "como implementar o formulário de criar/editar carta?") e roda ela colando `SDD/spec.md` + `SDD/plan.md` **inteiros** vs. colando só `SDD/prompts/03-frontend.md` (contexto já curado daquela tarefa). Compara tokens de entrada. Não substitui a Tentativa 1/2 acima — é só um exemplo rápido e visual do `@file` vs. trecho relevante.

## Nota — não confundir com comparação de modelos

Se além disso vocês rodarem a mesma feature em modelos de IA diferentes (branches `experimento/modelo-*`, ver `plan.md` seção 2), isso é conteúdo extra bom pra apresentação, mas **não é** a evidência do requisito 3 — o requisito pede variação de *contexto*, com o mesmo modelo, não variação de modelo.
