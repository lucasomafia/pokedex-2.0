export default function Cabecalho({ tela, definirTela }) {
  return (
    <header>
      <h1>Pokédex</h1>
      <button aria-current={tela === "pokedex" ? "page" : undefined} onClick={() => definirTela("pokedex")}>Pokédex</button>{" "}
      <button aria-current={tela === "treinadores" ? "page" : undefined} onClick={() => definirTela("treinadores")}>Treinadores</button>
    </header>
  );
}
