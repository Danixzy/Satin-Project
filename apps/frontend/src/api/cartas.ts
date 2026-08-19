export type Carta = {
  id: number
  nome: string
  numero: string
  colecao: string
  imagem_url: string | null
  created_at: string
}

export type CartaInput = {
  nome: string
  numero: string
  colecao: string
  imagem_url?: string
}

const API_URL = import.meta.env.VITE_API_URL

export async function listarCartas(): Promise<Carta[]> {
  const res = await fetch(`${API_URL}/api/cartas`)
  if (!res.ok) throw new Error('Erro ao listar cartas')
  return res.json()
}

export async function buscarCarta(id: string): Promise<Carta> {
  const res = await fetch(`${API_URL}/api/cartas/${id}`)
  if (!res.ok) throw new Error('Erro ao buscar carta')
  return res.json()
}

export async function criarCarta(dados: CartaInput): Promise<Carta> {
  const res = await fetch(`${API_URL}/api/cartas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  if (!res.ok) throw new Error('Erro ao criar carta')
  return res.json()
}

export async function atualizarCarta(id: string, dados: CartaInput): Promise<Carta> {
  const res = await fetch(`${API_URL}/api/cartas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  if (!res.ok) throw new Error('Erro ao atualizar carta')
  return res.json()
}

export async function excluirCarta(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/cartas/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erro ao excluir carta')
}
