import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { excluirCarta, listarCartas, type Carta } from '../api/cartas';
import CardItem from '../components/CardItem';

export default function ListaCartas() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    listarCartas()
      .then(setCartas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  async function handleExcluir(carta: Carta) {
    const confirmado = window.confirm(`Excluir ${carta.nome}?`);
    if (!confirmado) return;

    try {
      await excluirCarta(String(carta.id));
      setCartas((atuais) => atuais.filter((c) => c.id !== carta.id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'erro ao excluir carta');
    }
  }

  return (
    <div className="pagina-lista">
      <header className="pagina-lista__cabecalho">
        <h1>Cartas</h1>
        <button
          type="button"
          className="botao-criar"
          onClick={() => navigate('/cartas/nova')}
        >
          Criar Carta
        </button>
      </header>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {!carregando && !erro && cartas.length === 0 && (
        <p className="mensagem-vazia">Nenhuma carta cadastrada ainda.</p>
      )}

      {!carregando && !erro && cartas.length > 0 && (
        <div className="grade-cartas">
          {cartas.map((carta) => (
            <CardItem key={carta.id} carta={carta} onExcluir={handleExcluir} />
          ))}
        </div>
      )}
    </div>
  );
}
