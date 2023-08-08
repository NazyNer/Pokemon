const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Pokemon, Type } = require('../../db');

router.get('/pokemons', async (req, res) => {
  try {
    const pokemons = await Pokemon.findAll();
    res.json(pokemons);
  } catch (error) {
    console.error('Error al obtener los pokemons:', error);
    res.status(500).json({ error: 'Error al obtener los pokemons' });
  }
});

// Ruta para crear un nuevo Pokémon desde la API y relacionarlo con sus tipos
router.post('/pokemons', async (req, res) => {
  try {
    const { Nombre } = req.body;
    const PokeNameLower = Nombre.toLowerCase();
    // Obtener datos del Pokémon desde la API

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${PokeNameLower}`);
    const apiData = response.data;
    const tipoNombres = apiData.types.map((tipo) => tipo.type.name);

    
    // Crear el Pokémon en la base de datos
    const createdPokemon = await Pokemon.create({
      Nombre: apiData.name,
      Imagen: apiData.sprites.other['official-artwork'].front_default,
      Vida: apiData.stats[0].base_stat,
      Ataque: apiData.stats[1].base_stat,
      Defensa: apiData.stats[2].base_stat,
      Velocidad: apiData.stats[5].base_stat,
      Altura: apiData.height,
      Peso: apiData.weight,
    });
    
    // Verificar si ya existen tipos en la base de datos
    const type = await TypeValidation()
    if (type) {
      // Obtener los tipos relacionados de la base de datos
      let selectedTypes = [];
      for (const tipoNombre of tipoNombres) {
        const type = await Type.findOne({ where: { nombre: tipoNombre } });
        if (type) {
          selectedTypes.push(type);
        }
      }
      // Relacionar los tipos con el Pokémon recién creado
      await createdPokemon.setTypes(selectedTypes);    
    }
    // Recargar el Pokémon con sus tipos
    const pokemonWithTypes = await Pokemon.findOne({
      where: { ID: createdPokemon.ID },
      include: Type
    });

    res.json(pokemonWithTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el Pokémon desde la API' });
  }
});

// Ruta para obtener el detalle de un Pokémon
router.get('/pokemons/:idPokemon', async (req, res) => {
  try {
    const { idPokemon } = req.params;

    // Intentar obtener el Pokémon de la base de datos
    const dbPokemon = await Pokemon.findByPk(idPokemon, {
      include: Type,
    });

    // Si el Pokémon no existe en la base de datos, obtenerlo de la API
    if (!dbPokemon) {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`);
      const apiData = response.data;

      // Obtener los nombres de los tipos del Pokémon desde la API
      const tipoNombres = apiData.types.map((tipo) => tipo.type.name);

      // Verificar si ya existen tipos en la base de datos
      const type = await TypeValidation()
      let selectedTypes = [];
      if (type) {
        for (const tipoNombre of tipoNombres) {
          const type = await Type.findOne({ where: { nombre: tipoNombre } });
          if (type) {
            selectedTypes.push(type);
          }
        }
      }
      // Crear un objeto con los datos del Pokémon y los tipos relacionados
      const apiPokemon = {
        ID: apiData.id,
        Nombre: apiData.name,
        Imagen: apiData.sprites.other['official-artwork'].front_default,
        Vida: apiData.stats[0].base_stat,
        Ataque: apiData.stats[1].base_stat,
        Defensa: apiData.stats[2].base_stat,
        Velocidad: apiData.stats[5].base_stat,
        Altura: apiData.height,
        Peso: apiData.weight,
        Tipos: selectedTypes
      };

      res.json(apiPokemon);
    } else {
      // Si el Pokémon existe en la base de datos, retornar su información
      res.json(dbPokemon);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el detalle del Pokémon' });
  }
});
async function TypeValidation() {
  const typeCount = await Type.count();
    if (typeCount === 0) {
      // Si no hay tipos en la base de datos, los obtenemos desde la API y los guardamos
      const responseTypes = await axios.get('https://pokeapi.co/api/v2/type');
      const typesFromAPI = responseTypes.data.results.map((type) => type.name);
      // Guardamos los tipos en la base de datos
      for (const type of typesFromAPI) {
        await Type.findOrCreate({
          where: { nombre: type },
          defaults: { nombre: type } // Solo se utilizará si no se encuentra ningún registro con el nombre dado
        });
      }
    }
    return true;
}
module.exports = router;