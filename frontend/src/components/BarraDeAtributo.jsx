const VALOR_MAXIMO = 255;

export default function BarraDeAtributo({ nome, valor }) {
  const porcentagem = (valor / VALOR_MAXIMO) * 100;

  return (
    <div className="stat">
      <span>{nome}</span>
      <div className="barra-fundo">
        <div className="barra" style={{ width: porcentagem + "%" }}></div>
      </div>
      <span>{valor}</span>
    </div>
  );
}
