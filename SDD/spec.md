# Spec — Gestão de Cartas (feature isolada)

> Fonte de verdade da feature. Qualquer dúvida de comportamento durante a implementação se resolve por este arquivo, não por suposição.

## 1. Contexto

Trabalho da disciplina de TI (Escola de TI, ver `user-stories.md`). Por instrução do trabalho, implementamos **só uma feature isolada**, sem integrar ao sistema real do app de colecionáveis. Feature escolhida: gestão de cartas do catálogo — cobre de forma simplificada a user story "Gestão de Catálogo" (seção 8, BackOffice) e as visualizações de carta do painel cliente (seção 2), reduzidas ao essencial de um CRUD.

Este projeto também serve de veículo pro Trabalho Prático 1 de Tecnologias Emergentes (`INSTRUCOES-TRABALHO.md`): a implementação é feita com apoio de IA, seguindo o system prompt definido em `system-prompt.md`, e cada chamada de IA usada pra construir isso vira evidência (tokens, custo, prints).

## 2. Objetivo

Uma única página onde é possível:

1. Ver todas as cartas cadastradas, em formato de listagem/grade.
2. Criar uma carta nova, através de um botão fixo no canto superior direito da tela.
3. Ao clicar em uma carta da listagem, ver duas opções: **Editar** e **Excluir**.
4. Editar reaproveita a mesma tela de criação, com os campos já preenchidos com os dados da carta.
5. Excluir remove a carta, com uma confirmação antes (evita exclusão acidental).

## 3. Fora de escopo (intencional)

Não implementar, mesmo que pareça faltar:

- Autenticação, login, permissões de usuário/admin.
- Upload de arquivo de imagem (usar apenas URL de imagem como campo de texto).
- Paginação, busca, filtros, ordenação.
- Categoria, raridade, idioma, estado de conservação, preço, quantidade, fotos múltiplas.
- Testes automatizados, CI.
- Qualquer coisa de marketplace, chat, grupos, notificações (fora do recorte desta feature).

Isso é proposital: o trabalho pede uma feature pequena e isolada, não o produto inteiro.

## 4. Entidade: Carta

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | number | gerado pelo banco | chave primária |
| `nome` | string | sim | nome da carta |
| `numero` | string | sim | número da carta dentro da coleção (ex: "025/102") — texto, não numérico, porque pode ter formato com barra/zeros à esquerda |
| `colecao` | string | sim | nome da coleção/expansão à qual a carta pertence |
| `imagem_url` | string | não | URL de uma imagem da carta; se vazio, a UI mostra um placeholder |
| `created_at` | timestamp | gerado pelo banco | usado só pra ordenação padrão (mais recente primeiro) |

## 5. Fluxo de UI

### Tela única: Listagem de Cartas (`/`)

- Grade de cards, um por carta cadastrada (imagem, nome, número, coleção).
- Botão **"Criar Carta"** fixo no canto superior direito da tela.
- Estado vazio (nenhuma carta cadastrada): mensagem simples + o mesmo botão de criar.
- Clicar em qualquer parte de um card abre um menu/popover com duas opções: **Editar** e **Excluir**.
  - **Editar** → navega para a tela de formulário em modo edição, campos pré-preenchidos.
  - **Excluir** → pede confirmação ("Excluir [nome da carta]?"); confirmando, chama a API e remove o card da lista sem recarregar a página inteira.

### Tela de Formulário (criar e editar, mesmo componente)

- Rota de criação: `/cartas/nova` — campos vazios.
- Rota de edição: `/cartas/:id/editar` — busca a carta pelo `id` e pré-preenche `nome`, `numero`, `colecao`, `imagem_url`.
- Campos: nome (texto), número (texto), coleção (texto), imagem URL (texto, opcional).
- Botão salvar: em modo criação faz `POST`, em modo edição faz `PUT`. Em ambos os casos, ao salvar com sucesso, redireciona de volta pra listagem (`/`).
- Validação mínima: `nome`, `numero` e `colecao` não podem ser vazios (validação de cliente antes de enviar).

## 6. Critérios de aceite

- [ ] Listagem carrega as cartas existentes ao abrir a página.
- [ ] Botão "Criar Carta" está sempre visível no canto superior direito, mesmo com lista vazia.
- [ ] Criar uma carta faz ela aparecer na listagem sem precisar dar refresh manual no navegador.
- [ ] Clicar num card mostra as opções Editar/Excluir (não navega direto pra edição sem esse passo intermediário).
- [ ] Editar abre o formulário com os 4 campos já preenchidos com os valores atuais da carta.
- [ ] Salvar uma edição atualiza o card na listagem.
- [ ] Excluir pede confirmação antes de remover.
- [ ] Excluir remove o card da listagem sem precisar dar refresh manual.
