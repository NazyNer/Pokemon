import React, { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import style from './Navbar.module.css'; // Asegúrate de tener tus estilos en un archivo CSS separado

function Navbar({
  handleSearchResult,
  types,
  selectedType,
  handleTypeChange,
  selectedSource,
  handleSourceChange,
  sortBy,
  handleSort,
  handleClearSort,
  searchTerm,
  setSearchTerm
}) {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
  };

  return (
    <nav className={style.Navbar}>
      <div className={style.NavbarContainer}>
        <div className={`${style.MobileMenuIcon} ${mobileMenuActive ? style.MobileMenuActive : ''}`} onClick={toggleMobileMenu}>
          <span className={style.IconBar1}></span>
          <span className={style.IconBar2}></span>
        </div>
        <div className={`${style.NavbarMenu} ${mobileMenuActive ? style.MobileMenuActive : ''}`}>
          <div className={style.NavbarItem}>
            <SearchBar onSearch={handleSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </div>
          <div className={style.NavbarItem}>
            <select id="typeSelect" value={selectedType || ''} onChange={handleTypeChange}>
              <option value="">Todos los tipos</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className={style.NavbarItem}>
            <select id="sourceSelect" value={selectedSource || ''} onChange={handleSourceChange}>
              <option value="">Todos los origenes</option>
              <option value="DB">Database</option>
              <option value="API">API</option>
            </select>
          </div>
          <div className={style.NavbarItem}>
            <button
              onClick={() => handleSort('alphabetical')}
            >
              {sortBy !== "Z-A" ? "a-z" : "z-a"}
            </button>
            <button
              onClick={() => handleSort('attack')}
            >
              {sortBy !== "descendente" ? "ataque(descendente)" : "ataque(ascendente)"}
            </button>
          </div>
            <button onClick={handleClearSort}>Limpiar</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
