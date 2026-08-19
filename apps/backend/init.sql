create table if not exists cartas (
  id serial primary key,
  nome text not null,
  numero text not null,
  colecao text not null,
  imagem_url text,
  created_at timestamptz not null default now()
);
