import { TIPOS } from "../data/tipos";

const URL_BASE = "/api/pokemons";
const TIPOS_COMO_TEXTO = false;

function normalizarTipo(tipo) {
  const nome = typeof tipo === "string" ? tipo : tipo?.name;
  const tipoConhecido = TIPOS.find((item) => item.name.toLowerCase() === String(nome).toLowerCase());
  return tipoConhecido ?? { id: nome, name: nome };
}

function normalizarPokemon(pokemon) {
  return { ...pokemon, types: (pokemon.types ?? []).map(normalizarTipo) };
}

function prepararParaEnvio(pokemon) {
  return {
    ...pokemon,
    types: pokemon.types.map((tipo) => (TIPOS_COMO_TEXTO ? tipo.name : { id: tipo.id, name: tipo.name })),
  };
}

async function requisitar(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes.headers },
  });
  if (!resposta.ok) {
    const mensagem = await resposta.text().catch(() => "");
    throw new Error(`Erro ${resposta.status}${mensagem ? `: ${mensagem}` : ""}`);
  }
  if (resposta.status === 204) return null;
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}

function ordenarPorNumero(pokemons) {
  return [...pokemons].sort((primeiro, segundo) => primeiro.id - segundo.id);
}

export async function listarPokemons() {
  const pokemons = await requisitar(URL_BASE);
  return ordenarPorNumero(pokemons.map(normalizarPokemon));
}

export async function criarPokemon(pokemon) {
  const criado = await requisitar(URL_BASE, { method: "POST", body: JSON.stringify(prepararParaEnvio(pokemon)) });
  return normalizarPokemon(criado ?? pokemon);
}

export async function atualizarPokemon(numero, pokemon) {
  const atualizado = await requisitar(`${URL_BASE}/${numero}`, { method: "PUT", body: JSON.stringify(prepararParaEnvio(pokemon)) });
  return normalizarPokemon(atualizado ?? pokemon);
}

export async function excluirPokemon(numero) {
  await requisitar(`${URL_BASE}/${numero}`, { method: "DELETE" });
}

export async function listarTreinadores() {
  const treinadores = await requisitar("/api/trainers");
  return ordenarPorNumero(treinadores);
}

export { ordenarPorNumero };
