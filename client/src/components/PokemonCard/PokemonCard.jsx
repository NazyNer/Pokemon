import style from './PokemonCard.module.css';


function PokemonCard ({ pokemon }) {
  const { Nombre, Imagen, Tipos } = pokemon;

  return (
    <div className={style.CardContainer}>
      <img className={style.PokemonImage} src={Imagen} alt={Nombre} />
      <h3 className={style.PokemonName} >{Nombre}</h3>
      <div className={style.PokemonTypes}>
        {Tipos.map((tipo, index) => (
          <span className={style.PokemonType} key={index}>{tipo}</span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;