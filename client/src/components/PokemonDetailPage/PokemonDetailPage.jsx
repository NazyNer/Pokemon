import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import style from './PokemonDetail.module.css'

function PokemonDetailPage() {
  const { idPokemon } = useParams();
  const [pokemonDetail, setPokemonDetail] = useState(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/pokemons/${idPokemon}`);
        setPokemonDetail(response.data);
      } catch (error) {
        console.error('Error fetching Pokémon detail:', error);
      }
    };

    fetchPokemonDetail();
  }, [idPokemon]);

  if (!pokemonDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.pokemonDetailContainer}>
      <h1 className={style.pageTitle}>Pokémon Detail</h1>
      <div className={style.pokemonInfo}>
        <p>ID: {pokemonDetail.ID}</p>
        <p>Nombre: {pokemonDetail.Nombre}</p>
        <img className={style.pokemonImage} src={pokemonDetail.Imagen} alt={pokemonDetail.Nombre} />
        <p>Vida: {pokemonDetail.Vida}</p>
        <p>Ataque: {pokemonDetail.Ataque}</p>
        <p>Defensa: {pokemonDetail.Defensa}</p>
        <p>Velocidad: {pokemonDetail.Velocidad}</p>
        <p>Altura: {pokemonDetail.Altura / 10}m</p>
        <p>Peso: {pokemonDetail.Peso}</p>
        <p>Tipo:
            {pokemonDetail.Tipos.map((type, index) => (
              <span key={index} className={`${style.pokemonType} ${style[type.nombre.toLowerCase()]}`}>
                {type.nombre}
              </span>
            ))}
        </p>
      </div>
    </div>
  );
}

export default PokemonDetailPage;