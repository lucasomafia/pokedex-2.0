import { urlDaImagem } from "../data/imagens";

export default function ListaTreinadores({ treinadores, pokemons, aoSelecionar }) {
  const pokemonPorNumero = new Map(pokemons.map((pokemon) => [pokemon.id, pokemon]));

  return (
    <section aria-label="Treinadores" className="trainer-list">
      {treinadores.map((treinador) => (
        <article className="trainer-card" key={treinador.id}>
          <span className="eyebrow">Treinador #{String(treinador.id).padStart(2, "0")}</span>
          <h2>{treinador.name}</h2>
          <p className="badges">★ {treinador.badges} {treinador.badges === 1 ? "insígnia" : "insígnias"}</p>
          <ul className="trainer-team">
            {treinador.pokemonIds.map((numero, posicao) => {
              const pokemon = pokemonPorNumero.get(numero);
              if (!pokemon) return null;
              return (
                <li key={`${numero}-${posicao}`}>
                  <button onClick={() => aoSelecionar(pokemon)} aria-label={`Ver detalhes de ${pokemon.name}`}>
                    <img loading="lazy" src={urlDaImagem(numero)} alt="" />
                    <span>{pokemon.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </section>
  );
}
