import style from './PokemonCardDB.module.css';
import { Link } from 'react-router-dom';

function PokemonCardDB ({ pokemon }) {
  const { Nombre, Imagen, types } = pokemon;
  var tipos = {}
  if (types[0].nombre) {
    tipos = types.map(type => type.nombre)
  } else{
    tipos = types;
  };
  return (
    <Link to={`/detail/${pokemon.ID}`} className={style.cardLink}>
    <div className={style.card}>
      <img className={style.cardImage} src={Imagen} alt={Nombre} />
      <h3 className={style.cardName} >{Nombre}</h3>
      <div className={style.cardTypes}>
        {
        tipos.map((tipo, index) => (
          <span key={index} className={`${style.cardType} ${style[tipo]}`}>{tipo}</span>
        ))
        }
      </div>
    </div>
    </Link>
  );
};

export default PokemonCardDB;