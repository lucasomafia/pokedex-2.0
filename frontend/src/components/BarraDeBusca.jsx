export default function BarraDeBusca({ busca, definirBusca }) {
  return (
    <input
      type="search"
      aria-label="Pesquisar Pokémon por nome ou número"
      placeholder="Pesquisar Pokémon..."
      value={busca}
      onChange={(evento) => definirBusca(evento.target.value)}
    />
  );
}
