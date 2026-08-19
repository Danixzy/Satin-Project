import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarCartas, excluirCarta, type Carta } from '../api/cartas'
import CardItem from '../components/CardItem'

function ListaCartas() {
  const [cartas, setCartas] = useState<Carta[]>([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    listarCartas()
      .then(setCartas)
      .finally(() => setCarregando(false))
  }, [])

  async function handleExcluir(carta: Carta) {
    if (!window.confirm(`Excluir ${carta.nome}?`)) return
    await excluirCarta(String(carta.id))
    setCartas((atual) => atual.filter((c) => c.id !== carta.id))
  }

  return (
    <div className="lista-cartas">
      <header className="cabecalho">
        <h1>Gestão de Cartas</h1>
      </header>
      <button className="botao-criar" onClick={() => navigate('/cartas/nova')}>
        + Criar Carta
      </button>
      {carregando ? (
        <p className="estado-vazio">Carregando...</p>
      ) : cartas.length === 0 ? (
        <div className="estado-vazio">
          <p>Nenhuma carta cadastrada ainda.</p>
        </div>
      ) : (
        <div className="grade-cartas">
          {cartas.map((carta) => (
            <CardItem key={carta.id} carta={carta} onExcluir={handleExcluir} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ListaCartas
