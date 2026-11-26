import { useEffect, useRef, useState } from "react";
import { TIPOS } from "../data/tipos";
import { ATRIBUTOS } from "../data/atributos";

function valoresIniciais(pokemon) {
  return {
    numero: pokemon.id ?? "",
    nome: pokemon.name ?? "",
    tipoPrincipal: pokemon.types?.[0]?.name ?? "",
    tipoSecundario: pokemon.types?.[1]?.name ?? "",
    ...Object.fromEntries(ATRIBUTOS.map(([chave]) => [chave, pokemon.stats?.[chave] ?? 50])),
  };
}

export default function FormularioPokemon({ pokemon, numerosExistentes, aoSalvar, aoFechar }) {
  const editando = Boolean(pokemon.id);
  const janela = useRef(null);
  const [valores, definirValores] = useState(() => valoresIniciais(pokemon));
  const [erro, definirErro] = useState("");
  const [salvando, definirSalvando] = useState(false);

  useEffect(() => {
    const elemento = janela.current;
    const rolagemAnterior = document.body.style.overflow;
    elemento.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      elemento.close();
      document.body.style.overflow = rolagemAnterior;
    };
  }, []);

  function alterarCampo(campo, valor) {
    definirValores((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  function validar() {
    const numero = Number(valores.numero);
    const nome = valores.nome.trim();
    if (!Number.isInteger(numero) || numero < 1) return { erro: "O número precisa ser um inteiro maior que zero." };
    if (!editando && numerosExistentes.includes(numero)) return { erro: `Já existe um Pokémon com o número #${numero}.` };
    if (!nome) return { erro: "Informe o nome." };
    if (!valores.tipoPrincipal) return { erro: "Escolha pelo menos o tipo principal." };
    if (valores.tipoSecundario && valores.tipoSecundario === valores.tipoPrincipal) return { erro: "Os dois tipos precisam ser diferentes." };

    const atributos = {};
    for (const [chave, rotulo] of ATRIBUTOS) {
      const valor = Number(valores[chave]);
      if (!Number.isInteger(valor) || valor < 1 || valor > 255) return { erro: `${rotulo} precisa ser um inteiro de 1 a 255.` };
      atributos[chave] = valor;
    }

    const tipos = [valores.tipoPrincipal, valores.tipoSecundario]
      .filter(Boolean)
      .map((nomeDoTipo) => TIPOS.find((tipo) => tipo.name === nomeDoTipo));

    return { pokemon: { id: numero, name: nome, types: tipos, stats: atributos } };
  }

  async function enviar(evento) {
    evento.preventDefault();
    definirErro("");

    const resultado = validar();
    if (resultado.erro) {
      definirErro(resultado.erro);
      return;
    }

    definirSalvando(true);
    try {
      await aoSalvar(resultado.pokemon);
    } catch (falha) {
      definirErro(`Não foi possível salvar: ${falha.message}`);
      definirSalvando(false);
    }
  }

  return (
    <dialog ref={janela} className="pokemon-modal pokemon-form" aria-labelledby="titulo-formulario" onCancel={aoFechar}>
      <button className="modal-close" type="button" aria-label="Fechar formulário" onClick={aoFechar}>×</button>
      <h2 id="titulo-formulario">{editando ? `Editar ${pokemon.name}` : "Novo Pokémon"}</h2>

      <form onSubmit={enviar} noValidate>
        <label>
          Número
          <input type="number" min="1" value={valores.numero} disabled={editando} autoFocus={!editando}
            onChange={(evento) => alterarCampo("numero", evento.target.value)} />
        </label>
        <label>
          Nome
          <input type="text" value={valores.nome} autoFocus={editando}
            onChange={(evento) => alterarCampo("nome", evento.target.value)} />
        </label>
        <div className="form-linha">
          <label>
            Tipo principal
            <select value={valores.tipoPrincipal} onChange={(evento) => alterarCampo("tipoPrincipal", evento.target.value)}>
              <option value="">Escolha...</option>
              {TIPOS.map((tipo) => <option key={tipo.id} value={tipo.name}>{tipo.name}</option>)}
            </select>
          </label>
          <label>
            Tipo secundário
            <select value={valores.tipoSecundario} onChange={(evento) => alterarCampo("tipoSecundario", evento.target.value)}>
              <option value="">Nenhum</option>
              {TIPOS.map((tipo) => <option key={tipo.id} value={tipo.name}>{tipo.name}</option>)}
            </select>
          </label>
        </div>

        <fieldset>
          <legend>Atributos (1 a 255)</legend>
          <div className="form-stats">
            {ATRIBUTOS.map(([chave, rotulo]) => (
              <label key={chave}>
                {rotulo}
                <input type="number" min="1" max="255" value={valores[chave]}
                  onChange={(evento) => alterarCampo(chave, evento.target.value)} />
              </label>
            ))}
          </div>
        </fieldset>

        {erro && <p className="aviso-erro" role="alert">{erro}</p>}

        <div className="form-botoes">
          <button type="button" onClick={aoFechar}>Cancelar</button>
          <button type="submit" className="botao-primario" disabled={salvando}>
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
