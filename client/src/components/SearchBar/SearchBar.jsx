import React, { useState } from 'react';
import axios from 'axios';
import style from './SearchBar.module.css'

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      if (searchTerm.trim() === '') {
        onSearch({Error: "No escribiste nada..."})
        return;
      }

      const response = await axios.get(`http://localhost:3001/pokemon/name?name=${searchTerm}`);
      console.log(response.data)
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