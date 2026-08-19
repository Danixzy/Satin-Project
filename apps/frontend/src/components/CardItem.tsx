import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Carta } from '../api/cartas';

const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="320" viewBox="0 0 240 320">
      <rect width="240" height="320" fill="#e2e2e2"/>
      <text x="120" y="165" font-family="sans-serif" font-size="16" fill="#888" text-anchor="middle">sem imagem</text>
    </svg>`
  );

interface CardItemProps {
  carta: Carta;
  onExcluir: (carta: Carta) => void;
}

export default function CardItem({ carta, onExcluir }: CardItemProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function aoClicarFora(evento: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(evento.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  return (
    <div className="card-item" ref={containerRef}>
      <button
        type="button"
        className="card-item__botao"
        onClick={() => setMenuAberto((aberto) => !aberto)}
        aria-haspopup="true"
        aria-expanded={menuAberto}
      >
        <img
          className="card-item__imagem"
          src={carta.imagem_url || PLACEHOLDER_IMG}
          alt={carta.nome}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMG;
          }}
        />
        <div className="card-item__info">
          <strong className="card-item__nome">{carta.nome}</strong>
          <span className="card-item__numero">{carta.numero}</span>
          <span className="card-item__colecao">{carta.colecao}</span>
        </div>
      </button>

      {menuAberto && (
        <div className="card-item__menu">
          <button
            type="button"
            className="card-item__menu-opcao"
            onClick={() => navigate(`/cartas/${carta.id}/editar`)}
          >
            Editar
          </button>
          <button
            type="button"
            className="card-item__menu-opcao card-item__menu-opcao--perigo"
            onClick={() => {
              setMenuAberto(false);
              onExcluir(carta);
            }}
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
