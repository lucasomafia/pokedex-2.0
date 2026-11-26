export default function Filtros({ tipos, tipoSelecionado, definirTipoSelecionado }) {
  return (
    <select
      aria-label="Filtrar por tipo"
      value={tipoSelecionado}
      onChange={(evento) => definirTipoSelecionado(evento.target.value)}
    >
      <option value="">Todos os tipos</option>
      {tipos.map((tipo) => (
        <option key={tipo.id} value={tipo.name}>
          {tipo.name}
        </option>
      ))}
    </select>
  );
}
