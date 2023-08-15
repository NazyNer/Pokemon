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
            <SearchBar onSearch={handleSearchResult} />
          </div>
          <div className={style.NavbarItem}>
            <label htmlFor="typeSelect">Filtrar por tipo:</label>
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
            <label htmlFor="sourceSelect">Filtrar por origen:</label>
            <select id="sourceSelect" value={selectedSource || ''} onChange={handleSourceChange}>
              <option value="">Todos los origenes</option>
              <option value="DB">Database</option>
              <option value="API">API</option>
            </select>
          </div>
          <div className={style.NavbarItem}>
            <button
              className={sortBy === 'alphabetical' ? style.activeSortButton : ''}
              onClick={() => handleSort('alphabetical')}
            >
              Ordenar alfabeticamente
            </button>
            <button
              className={sortBy === 'attack' ? style.activeSortButton : ''}
              onClick={() => handleSort('attack')}
            >
              Ordenar por ataque
            </button>
            <button onClick={handleClearSort}>Limpiar ordenamiento</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
