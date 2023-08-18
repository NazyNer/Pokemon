import React from 'react';
import axios from 'axios';
import style from './SearchBar.module.css'

function SearchBar({ onSearch, searchTerm, setSearchTerm }) {

  const handleSearch = async () => {
    try {
      if (searchTerm.trim() === '') {
        onSearch({Error: "No escribiste nada..."})
        return;
      }
      if (!isNaN(searchTerm)) {
        onSearch({Error: "No se puede buscar por numero"})
        return;
      }
      const response = await axios.get(`http://localhost:3001/pokemon/name?name=${searchTerm}`);
      onSearch(response.data);
    } catch (error) {
      onSearch({Error: 'No se encontro el pokemon "'+ searchTerm + '"' });
    }
  };

  return (
    <div className={style.searchBarContainer}>
      <input
        className={style.searchInput} type="text" placeholder="buscar por nombre" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className={style.searchButton} onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;