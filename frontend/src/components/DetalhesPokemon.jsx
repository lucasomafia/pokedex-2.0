import { useEffect, useRef } from "react";
import BarraDeAtributo from "./BarraDeAtributo";
import { ATRIBUTOS } from "../data/atributos";
import { urlDaImagem } from "../data/imagens";

export default function DetalhesPokemon({ pokemon, aoFechar, aoEditar, aoExcluir }) {
  const janela = useRef(null);

  useEffect(() => {
    const elemento = janela.current;
    const focoAnterior = document.activeElement;
    const rolagemAnterior = document.body.style.overflow;
    elemento.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      elemento.close();
      document.body.style.overflow = rolagemAnterior;
      focoAnterior?.focus();
    };
  }, []);

  function aoClicarFora(evento) {
    if (evento.target !== evento.currentTarget) return;
    const area = evento.currentTarget.getBoundingClientRect();
    const fora =
      evento.clientX < area.left || evento.clientX > area.right ||
      evento.clientY < area.top || evento.clientY > area.bottom;
    if (fora) aoFechar();
  }

  return (
    <dialog ref={janela} className="pokemon-modal" aria-labelledby="titulo-detalhes" onCancel={aoFechar} onClick={aoClicarFora}>
      <button className="modal-close" aria-label="Fechar detalhes" onClick={aoFechar} autoFocus>×</button>
      <img className="detail-image" src={urlDaImagem(pokemon.id)} alt={pokemon.name} />
      <span className="card-id">#{String(pokemon.id).padStart(3, "0")}</span>
      <h2 id="titulo-detalhes">{pokemon.name}</h2>
      <div className="card-tipos">
        {pokemon.types.map((tipo) => (
          <span key={tipo.id} className={`tipo tipo-${tipo.name.toLowerCase()}`}>{tipo.name}</span>
        ))}
      </div>
      <div className="detail-stats">
        {ATRIBUTOS.map(([chave, rotulo]) => (
          <BarraDeAtributo key={chave} nome={rotulo} valor={pokemon.stats[chave]} />
        ))}
      </div>
      <div className="detail-acoes">
        <button onClick={() => aoEditar(pokemon)}>Editar</button>
        <button className="botao-perigo" onClick={() => aoExcluir(pokemon)}>Excluir</button>
      </div>
    </dialog>
  );
}
