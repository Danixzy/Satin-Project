import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { buscarCarta, criarCarta, atualizarCarta } from '../api/cartas'

function FormularioCarta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const modoEdicao = Boolean(id)

  const [nome, setNome] = useState('')
  const [numero, setNumero] = useState('')
  const [colecao, setColecao] = useState('')
  const [imagemUrl, setImagemUrl] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!id) return
    buscarCarta(id).then((carta) => {
      setNome(carta.nome)
      setNumero(carta.numero)
      setColecao(carta.colecao)
      setImagemUrl(carta.imagem_url || '')
    })
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!nome.trim() || !numero.trim() || !colecao.trim()) {
      setErro('Nome, número e coleção são obrigatórios.')
      return
    }

    const dados = { nome, numero, colecao, imagem_url: imagemUrl || undefined }

    if (modoEdicao && id) {
      await atualizarCarta(id, dados)
    } else {
      await criarCarta(dados)
    }

    navigate('/')
  }

  return (
    <div className="formulario-carta">
      <div className="formulario-carta__cartao">
        <h2>{modoEdicao ? 'Editar Carta' : 'Criar Carta'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Nome</span>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Charizard" />
          </label>
          <label>
            <span>Número</span>
            <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ex: 025/102" />
          </label>
          <label>
            <span>Coleção</span>
            <input value={colecao} onChange={(e) => setColecao(e.target.value)} placeholder="Ex: Base Set" />
          </label>
          <label>
            <span>Imagem URL</span>
            <input
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
              placeholder="https://... (opcional)"
            />
          </label>
          {erro && <p className="erro">{erro}</p>}
          <button type="submit" className="botao-primario">
            Salvar
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormularioCarta
