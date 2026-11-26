import { useEffect, useState } from "react";
import { TIPOS } from "./data/tipos";
import { listarPokemons, listarTreinadores, criarPokemon, atualizarPokemon, excluirPokemon, ordenarPorNumero } from "./api/pokemons";
import Cabecalho from "./components/Cabecalho";
import BarraDeBusca from "./components/BarraDeBusca";
import Filtros from "./components/Filtros";
import ListaPokemon from "./components/ListaPokemon";
import DetalhesPokemon from "./components/DetalhesPokemon";
import FormularioPokemon from "./components/FormularioPokemon";
import ListaTreinadores from "./components/ListaTreinadores";

export default function App() {
  const [pokemons, definirPokemons] = useState([]);
  const [treinadores, definirTreinadores] = useState([]);
  const [erroTreinadores, definirErroTreinadores] = useState("");
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");
  const [busca, definirBusca] = useState("");
  const [tipoSelecionado, definirTipoSelecionado] = useState("");
  const [pokemonSelecionado, definirPokemonSelecionado] = useState(null);
  const [pokemonEmEdicao, definirPokemonEmEdicao] = useState(null);
  const [tela, definirTela] = useState("pokedex");

  useEffect(() => {
    listarPokemons()
      .then(definirPokemons)
      .catch((falha) => definirErro(`Não foi possível carregar os Pokémon (${falha.message}). O back-end está rodando?`))
      .finally(() => definirCarregando(false));

    listarTreinadores()
      .then(definirTreinadores)
      .catch((falha) => definirErroTreinadores(`Não foi possível carregar os treinadores (${falha.message}).`));
  }, []);

  const pokemonsFiltrados = pokemons.filter((pokemon) => {
    const buscaCombina =
      pokemon.name.toLowerCase().includes(busca.toLowerCase()) ||
      String(pokemon.id) === busca;

    const tipoCombina =
      tipoSelecionado === "" || pokemon.types.some((tipo) => tipo.name === tipoSelecionado);

    return buscaCombina && tipoCombina;
  });

  async function salvar(pokemon) {
    const numeroEmEdicao = pokemonEmEdicao?.id;
    if (numeroEmEdicao) {
      const atualizado = await atualizarPokemon(numeroEmEdicao, pokemon);
      definirPokemons((lista) => lista.map((item) => (item.id === numeroEmEdicao ? atualizado : item)));
    } else {
      const criado = await criarPokemon(pokemon);
      definirPokemons((lista) => ordenarPorNumero([...lista, criado]));
    }
    definirPokemonEmEdicao(null);
    definirPokemonSelecionado(null);
  }

  async function excluir(pokemon) {
    if (!window.confirm(`Excluir ${pokemon.name} (#${pokemon.id})? Essa ação não pode ser desfeita.`)) return;
    try {
      await excluirPokemon(pokemon.id);
      definirPokemons((lista) => lista.filter((item) => item.id !== pokemon.id));
      definirPokemonSelecionado(null);
    } catch (falha) {
      window.alert(`Não foi possível excluir: ${falha.message}`);
    }
  }

  function abrirEdicao(pokemon) {
    definirPokemonSelecionado(null);
    definirPokemonEmEdicao(pokemon);
  }

  return (
    <>
      <Cabecalho tela={tela} definirTela={definirTela} />
      <main>
        {carregando && <p className="aviso">Carregando Pokémon...</p>}
        {erro && <p className="aviso aviso-erro" role="alert">{erro}</p>}
        {!carregando && !erro && (tela === "pokedex" ? (
          <>
            <div className="barra-acoes">
              <BarraDeBusca busca={busca} definirBusca={definirBusca} />
              <Filtros tipos={TIPOS} tipoSelecionado={tipoSelecionado} definirTipoSelecionado={definirTipoSelecionado} />
              <button className="botao-primario" onClick={() => definirPokemonEmEdicao({})}>+ Novo Pokémon</button>
            </div>
            <ListaPokemon pokemons={pokemonsFiltrados} aoSelecionar={definirPokemonSelecionado} />
          </>
        ) : erroTreinadores ? (
          <p className="aviso aviso-erro" role="alert">{erroTreinadores}</p>
        ) : (
          <ListaTreinadores treinadores={treinadores} pokemons={pokemons} aoSelecionar={definirPokemonSelecionado} />
        ))}
      </main>
      {pokemonSelecionado && (
        <DetalhesPokemon
          pokemon={pokemonSelecionado}
          aoFechar={() => definirPokemonSelecionado(null)}
          aoEditar={abrirEdicao}
          aoExcluir={excluir}
        />
      )}
      {pokemonEmEdicao && (
        <FormularioPokemon
          pokemon={pokemonEmEdicao}
          numerosExistentes={pokemons.map((pokemon) => pokemon.id)}
          aoSalvar={salvar}
          aoFechar={() => definirPokemonEmEdicao(null)}
        />
      )}
    </>
  );
}
