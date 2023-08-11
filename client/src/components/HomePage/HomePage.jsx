import React, { useState } from 'react';
import PokemonCard from '../PokemonCard/PokemonCard';
// import { useDispatch } from 'react-redux';
import axios from 'axios';

function HomePage({ pokemons }) {
  const [Pokemons, setPokemons] = useState([]);
  // const dispatch = useDispatch();
  function primerosPokemons() {
    axios(`http://localhost:3001/pokemons`).then((respuesta) => {
      if (respuesta.data) {
        setPokemons((oldChars) =>[...oldChars, respuesta.data.results])
      }
    }).catch((err) => {
      console.log(err);
      window.alert(err.response.data.error);
    });
  };
  window.onload = primerosPokemons();
  return <div>
    <h1>Home Page</h1>
    <div>
      {Pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.ID} pokemon={pokemon} />
      ))}
    </div>
  </div>;
};

export default HomePage;