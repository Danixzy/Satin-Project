const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Carta {
  id: number;
  nome: string;
  numero: string;
  colecao: string;
  imagem_url: string | null;
  created_at: string;
}

export interface CartaInput {
  nome: string;
  numero: string;
  colecao: string;
  imagem_url: string;
}

async function tratarResposta<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const corpo = await res.json().catch(() => ({}));
    throw new Error(corpo.error || `erro na requisicao (status ${res.status})`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export function listarCartas(): Promise<Carta[]> {
  return fetch(`${API_URL}/api/cartas`).then((res) => tratarResposta<Carta[]>(res));
}

export function buscarCarta(id: string): Promise<Carta> {
  return fetch(`${API_URL}/api/cartas/${id}`).then((res) => tratarResposta<Carta>(res));
}

export function criarCarta(dados: CartaInput): Promise<Carta> {
  return fetch(`${API_URL}/api/cartas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then((res) => tratarResposta<Carta>(res));
}

export function editarCarta(id: string, dados: CartaInput): Promise<Carta> {
  return fetch(`${API_URL}/api/cartas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then((res) => tratarResposta<Carta>(res));
}

export function excluirCarta(id: string): Promise<void> {
  return fetch(`${API_URL}/api/cartas/${id}`, { method: 'DELETE' }).then((res) =>
    tratarResposta<void>(res)
  );
}
