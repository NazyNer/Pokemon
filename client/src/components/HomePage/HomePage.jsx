import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import style from './HomePage.module.css';
import PokemonCard from '../PokemonCard/PokemonCard';
import Navbar from '../Navbar/Navbar';
import PokemonCardDB from '../PokemonCardDB/PokemonCardDB';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';


function HomePage({ types }) {
  const [pokemons, setPokemons] = useState([]);
  const [originalPokemons, setOriginalPokemons] = useState([]);
  const [pokemonChunks, setPokemonChunks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response1 = await axios.get('http://localhost:3001/pokemons');
        const response2 = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const existingPokemonNames = response1.data.map(pokemon => pokemon.Nombre);
        const newPokemons = response2.data.results.filter(pokemon => {
          return !existingPokemonNames.includes(pokemon.name);
        });

        const pokemonDataPromises = newPokemons.map(async pokemon => {
          const detailedResponse = await axios.get(pokemon.url);
          return {
            id: detailedResponse.data.id,
            Nombre: detailedResponse.data.name,
            types: detailedResponse.data.types.map(typeObj => typeObj.type.name),
            image: detailedResponse.data.sprites.other['official-artwork'].front_default,
            Ataque: detailedResponse.data.stats[1].base_stat,
            source: 'API',
          };
        });

        const detailedPokemonData = await Promise.all(pokemonDataPromises);
        const combinedPokemons = [
          ...response1.data.map(pokemon => ({ ...pokemon, source: 'DB' })),
          ...detailedPokemonData,
        ];
        setPokemons(combinedPokemons)
        setLoading(false);
        setOriginalPokemons(combinedPokemons);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPokemons();
  }, []);
  useEffect(() => {
    const chunkSize = 9;
    const chunks = [];
    for (let i = 0; i < pokemons.length; i += chunkSize) {
      chunks.push(pokemons.slice(i, i + chunkSize));
    }
    setPokemonChunks(chunks);
  }, [pokemons]);

  const handleNextPage = () => {
    if (currentPage < pokemonChunks.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleSearchResult = (searchResponse) => {
    var simplifiedPokemons = {};
    if (searchResponse.Error) {
      alert(searchResponse.Error);
      setPokemons(originalPokemons);
    } else {
      if (searchResponse[0].Nombre) {
        simplifiedPokemons = searchResponse.map(pokemon => ({
          ID: pokemon.ID,
          Nombre: pokemon.Nombre,
          Imagen: pokemon.Imagen,
          types: pokemon.types.map(type => type.nombre),
          Ataque: pokemon.Ataque,
          source: 'DB'
        }));
      }else{
        simplifiedPokemons = searchResponse.map(pokemon => ({
          id: pokemon.ID,
          name: pokemon.Nombre,
          image: pokemon.Imagen,
          types: pokemon.Tipos.map(type => type.nombre),
          attack: pokemon.Ataque,
          source: 'API'
        }));
      }
      setCurrentPage(0)
      setPokemons(simplifiedPokemons);
    }
  };
  const handleSort = (sortType) => {
    let sortedPokemons = [...pokemons];
    if (sortType === 'alphabetical') {
      if (sortBy === 'alphabetical') {
        sortedPokemons.sort((a, b) => b.Nombre.localeCompare(a.Nombre));
        setSortBy("Z-A");
      } else {
        sortedPokemons.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
        setSortBy('alphabetical');
      }
    } else if (sortType === 'attack') {
      if (sortBy === 'attack') {
        console.log(sortedPokemons);
        sortedPokemons.sort((a, b) => a.Ataque - b.Ataque);
        setSortBy('descendente');
      } else {
        console.log(sortedPokemons);
        sortedPokemons.sort((a, b) => b.Ataque - a.Ataque);
        setSortBy('attack');
      }
    }
    setPokemons([...sortedPokemons]);
  };
  const handleClear = () => {
    setSortBy(null);
    setSelectedSource(null)
    setPokemons(originalPokemons);
    setSelectedType('');
    setSearchTerm('');
  };
  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);
    if (selectedType === '') {
      setPokemons(originalPokemons);
    } else {
      const filteredPokemons = originalPokemons.filter(pokemon =>
        pokemon.types.includes(selectedType)
      );
      setPokemons(filteredPokemons);
    }
  };
  const handleSourceChange = (event) => {
    const selectedSource = event.target.value;
    setSelectedSource(selectedSource);
    if (selectedSource === '') {
      setPokemons(originalPokemons);
    } else {
      let filteredPokemons = [...originalPokemons];

      if (selectedSource !== '') {
        filteredPokemons = filteredPokemons.filter(pokemon =>
          pokemon.source === selectedSource
        );
      }

      setPokemons(filteredPokemons);
    }
  };

  return (
    <div className={style.homePageContainer}>
      <h1 className={style.pageTitle}>Pokedex</h1>
      <Link className={style.navButton} to={`/`}>volver</Link>
      <Link to="/CreatePokemon" className={style.navButton} >
        Crear Pokemon
      </Link>
      <Navbar
        handleSearchResult={handleSearchResult}
        types={types}
        selectedType={selectedType}
        handleTypeChange={handleTypeChange}
        selectedSource={selectedSource}
        handleSourceChange={handleSourceChange}
        sortBy={sortBy}
        handleSort={handleSort}
        handleClearSort={handleClear}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {/* Botones de paginacion */}
      <div className={style.paginationButtons}>
        <button className={style.button} onClick={handlePrevPage} disabled={currentPage === 0}>
          Anterior
        </button>
        <h2>{currentPage === 0 ? '' : currentPage}</h2>
        <h1>{currentPage + 1}</h1>
        <h2>{currentPage === pokemonChunks.length - 1 ? '' : currentPage + 2 }</h2>
        <button className={style.button} onClick={handleNextPage} disabled={currentPage === pokemonChunks.length - 1}>
          Siguiente
        </button>
      </div>
      <ul className={style.pokemonList}>
        {loading ? <LoadingSpinner /> : (<>
          {pokemonChunks.length > 0 ? (
            (pokemonChunks[currentPage].map((pokemon, index) => (
              pokemon.source !== 'DB' ? (<PokemonCard key={index} pokemon={pokemon} />) : (<PokemonCardDB key={index} pokemon={pokemon} />)
            )))
          ) : (
            <p>No hay Pokémon disponibles.</p>
          )}
        </>)}
      </ul>
    </div>
  );
};

export default HomePage;