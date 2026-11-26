import BarraDeAtributo from "./BarraDeAtributo";
import { ATRIBUTOS } from "../data/atributos";
import { urlDaImagem } from "../data/imagens";
import "./CartaoPokemon.css";

export default function CartaoPokemon({ pokemon, aoSelecionar }) {
  function aoPressionarTecla(evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      aoSelecionar(pokemon);
    }
  }

  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${pokemon.name}`}
      onClick={() => aoSelecionar(pokemon)}
      onKeyDown={aoPressionarTecla}
    >
      <img src={urlDaImagem(pokemon.id)} alt={pokemon.name} />

      <span className="card-id">#{pokemon.id}</span>
      <h2>{pokemon.name}</h2>

      <div className="card-tipos">
        {pokemon.types.map((tipo) => (
          <span key={tipo.id} className={"tipo tipo-" + tipo.name.toLowerCase()}>
            {tipo.name}
          </span>
        ))}
      </div>

      {ATRIBUTOS.map(([chave, rotulo]) => (
        <BarraDeAtributo key={chave} nome={rotulo} valor={pokemon.stats[chave]} />
      ))}
    </div>
  );
}
