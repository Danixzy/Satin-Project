import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Carta } from '../api/cartas'

type CardItemProps = {
  carta: Carta
  onExcluir: (carta: Carta) => void
}

function CardItem({ carta, onExcluir }: CardItemProps) {
  const [menuAberto, setMenuAberto] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      className={`card-item${menuAberto ? ' card-item--aberto' : ''}`}
      onClick={() => setMenuAberto((aberto) => !aberto)}
    >
      <div className="card-item__imagem">
        {carta.imagem_url ? (
          <img src={carta.imagem_url} alt={carta.nome} />
        ) : (
          <div className="placeholder-imagem">Sem imagem</div>
        )}
      </div>
      <div className="card-item__corpo">
        <h3 className="card-item__titulo">{carta.nome}</h3>
        <div className="card-item__meta">
          <span className="card-item__numero">{carta.numero}</span>
          <span className="card-item__colecao">{carta.colecao}</span>
        </div>
      </div>
      {menuAberto && (
        <div className="card-item-menu">
          <button
            className="card-item-menu__item"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/cartas/${carta.id}/editar`)
            }}
          >
            Editar
          </button>
          <button
            className="card-item-menu__item card-item-menu__item--excluir"
            onClick={(e) => {
              e.stopPropagation()
              onExcluir(carta)
            }}
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  )
}

export default CardItem
