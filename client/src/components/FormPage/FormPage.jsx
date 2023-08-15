import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import style from './FormPage.module.css';

function FormPage({ types }) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    vida: '',
    ataque: '',
    defensa: '',
    velocidad: '',
    altura: '',
    peso: '',
    tipos: [],
  });
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if(name === "altura") {
      setFormData({
          ...formData,
          [name]: value,
        })
    }else{
      setFormData({
          ...formData,
          [name]: value,
        });
    }
  };

  const handleTypeSelection = (event) => {
    const selectedType = event.target.value;
    if (selectedTypes.includes(selectedType)) {
      setSelectedTypes(selectedTypes.filter(type => type !== selectedType));
    } else {
      console.log(selectedTypes);
      setSelectedTypes([...selectedTypes, selectedType]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validar campos obligatorios
    if (!formData.name || !formData.image || !formData.vida || !formData.ataque || !formData.defensa) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }
    try {
      console.log(selectedTypes);
      const FormSend = formData;
      FormSend.tipos = selectedTypes;
      FormSend.altura = FormSend.altura * 10
      console.log(FormSend);
      const response = await axios.post('http://localhost:3001/pokemons', FormSend);
      alert('Pokemon creado: ', response);
      // Limpiar campos después de la creación exitosa
      setFormData({
        name: '',
        image: '',
        vida: '',
        ataque: '',
        defensa: '',
        velocidad: '',
        altura: '' * 10,
        peso: '',
        tipos: [],
      });
      setSelectedTypes([]);
    } catch (error) {
      console.error('Error al crear el Pokemon:', error);
    }
  };


  return (
    <div className={style.formContainer}>
      <Link to="/Home" className={style.navButton}>Volver</Link>
      <h1>Form Page</h1>
      <p>Los campos con * son oblicatorios</p>
      <form  onSubmit={handleSubmit}>
        <input className={style.formInput} type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre*" />
        <input className={style.formInput} type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="Imagen URL*" />
        <input className={style.formInput} type="number" name="vida" value={formData.vida} onChange={handleInputChange} placeholder="Vida*" />
        <input className={style.formInput} type="number" name="ataque" value={formData.ataque} onChange={handleInputChange} placeholder="Ataque*" />
        <input className={style.formInput} type="number" name="defensa" value={formData.defensa} onChange={handleInputChange} placeholder="Defensa*" />
        <input className={style.formInput} type="number" name="velocidad" value={formData.velocidad} onChange={handleInputChange} placeholder="Velocidad" />
        <input className={style.formInput} type="number" name="altura" value={formData.altura} onChange={handleInputChange} placeholder="Altura" />
        <input className={style.formInput} type="number" name="peso" value={formData.peso} onChange={handleInputChange} placeholder="Peso" />

        <div className={style.typeOptions}>
          {types.map(type => (
            <label key={type} className={`${style.typeOption} ${style[type.toLowerCase()]}`}>
              <input
                type="checkbox"
                name="tipos"
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={handleTypeSelection}
              />
              {type}
            </label>
          ))}
        </div>

        <button type="submit">Crear Pokemon</button>
      </form>
    </div>
  );
}

export default FormPage;