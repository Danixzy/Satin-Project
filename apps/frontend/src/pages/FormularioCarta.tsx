import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buscarCarta, criarCarta, editarCarta, type CartaInput } from '../api/cartas';

const CAMPOS_VAZIOS: CartaInput = {
  nome: '',
  numero: '',
  colecao: '',
  imagem_url: '',
};

export default function FormularioCarta() {
  const { id } = useParams<{ id: string }>();
  const modoEdicao = Boolean(id);
  const navigate = useNavigate();

  const [campos, setCampos] = useState<CartaInput>(CAMPOS_VAZIOS);
  const [carregando, setCarregando] = useState(modoEdicao);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    buscarCarta(id)
      .then((carta) =>
        setCampos({
          nome: carta.nome,
          numero: carta.numero,
          colecao: carta.colecao,
          imagem_url: carta.imagem_url || '',
        })
      )
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [id]);

  function atualizarCampo(campo: keyof CartaInput, valor: string) {
    setCampos((atuais) => ({ ...atuais, [campo]: valor }));
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (!campos.nome.trim() || !campos.numero.trim() || !campos.colecao.trim()) {
      setErro('Nome, numero e colecao sao obrigatorios.');
      return;
    }

    setSalvando(true);
    try {
      if (modoEdicao && id) {
        await editarCarta(id, campos);
      } else {
        await criarCarta(campos);
      }
      navigate('/');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao salvar carta');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="pagina-formulario">
      <h1>{modoEdicao ? 'Editar Carta' : 'Criar Carta'}</h1>

      <form onSubmit={handleSubmit} className="formulario-carta">
        <label>
          Nome
          <input
            type="text"
            value={campos.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
          />
        </label>

        <label>
          Numero
          <input
            type="text"
            value={campos.numero}
            onChange={(e) => atualizarCampo('numero', e.target.value)}
            placeholder="ex: 025/102"
          />
        </label>

        <label>
          Colecao
          <input
            type="text"
            value={campos.colecao}
            onChange={(e) => atualizarCampo('colecao', e.target.value)}
          />
        </label>

        <label>
          Imagem (URL)
          <input
            type="text"
            value={campos.imagem_url}
            onChange={(e) => atualizarCampo('imagem_url', e.target.value)}
            placeholder="opcional"
          />
        </label>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <div className="formulario-carta__acoes">
          <button type="button" onClick={() => navigate('/')} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
