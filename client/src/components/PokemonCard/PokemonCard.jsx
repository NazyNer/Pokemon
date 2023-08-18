import style from './PokemonCard.module.css';
import { Link } from 'react-router-dom';

function PokemonCard ({ pokemon }) {
  const { Nombre, image, types } = pokemon;
  return (
    <Link to={`/detail/${pokemon.id}`} className={style.cardLink}>
    <div className={style.card}>
      <img className={style.cardImage} src={image} alt={Nombre} />
      <h3 className={style.cardName} >{Nombre}</h3>
      <div className={style.cardTypes}>
        {types.map((tipo, index) => (
          <span key={index} className={`${style.cardType} ${style[tipo]}`}>{tipo}</span>
        ))}
      </div>
    </div>
    </Link>
  );
};

export default PokemonCard;