import React, { useState, useEffect } from 'react';
import { BrowserRouter as Route, Routes  } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import HomePage from './components/HomePage/HomePage';
import NotFound from './components/NotFound/NotFound';
import axios from 'axios';
import PokemonDetailPage from './components/PokemonDetailPage/PokemonDetailPage';
import FormPage from './components/FormPage/FormPage';
import './App.css';

function App() {
  const [types, setTypes] = useState([]);
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/types');
        const typeNames = response.data.map(type => type);
        setTypes(typeNames);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };
    fetchTypes();
  }, []);
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home' element={<HomePage types={types}/>} />
          <Route path="/detail/:idPokemon" element={<PokemonDetailPage />} />
          <Route path="/CreatePokemon" element={<FormPage types={types}/>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
