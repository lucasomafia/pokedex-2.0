import CartaoPokemon from "./CartaoPokemon";

export default function ListaPokemon({ pokemons, aoSelecionar }) {
  if (pokemons.length === 0) {
    return <p className="vazio">Nenhum Pokémon encontrado</p>;
  }

  return (
    <div className="lista">
      {pokemons.map((pokemon) => (
        <CartaoPokemon key={pokemon.id} pokemon={pokemon} aoSelecionar={aoSelecionar} />
      ))}
    </div>
  );
}
