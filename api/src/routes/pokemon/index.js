const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Op } = require('sequelize');
const { Pokemon, Type } = require('../../db');
let lastApiId = 1281;
router.get('/pokemons', async (req, res) => {
  try {
    const pokemonsInDb = await Pokemon.findAll({include: Type});
    res.json(pokemonsInDb);
  } catch (error) {
    console.error('Error al obtener los pokemons:', error);
    res.status(500).json({ error: 'Error al obtener los pokemons' });
  }
});

// Ruta para crear un nuevo Pokémon desde la API y relacionarlo con sus tipos
router.post('/pokemons', async (req, res) => {
  try {
    const { name, image, vida, ataque, defensa, velocidad, altura, peso, tipos } = req.body;
    lastApiId++;
    // Crear el Pokémon en la base de datos
    const createdPokemon = await Pokemon.create({
      ID: lastApiId,
      Nombre: name,
      Imagen: image,
      Vida: vida,
      Ataque: ataque,
      Defensa: defensa,
      Velocidad: velocidad,
      Altura: altura,
      Peso: peso,
      type: tipos
    });

    // Verificar si existen tipos en la base de datos
    const type = await TypeValidation();
    if (type) {
      // Obtener los tipos relacionados de la base de datos
      const selectedTypes = await Type.findAll({ where: { nombre: tipos } });

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
    res.status(500).json({ error: 'Error al crear el Pokémon en la base de datos' });
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
      if(type){
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
        Imagen: apiData.sprites.other['official-artwork'].front_default != null ? apiData.sprites.other['official-artwork'].front_default : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX///8AAAClpaX29vb6+vrx8fGwsLDd3d3n5+fQ0NDj4+PNzc3Kysq9vb2srKzGxsabm5t1dXUbGxsUFBRBQUE5OTlbW1uSkpJOTk59fX2JiYnr6+tGRkZtbW3W1tagoKAsLCxkZGQoKCgLCwsZGRl6enozMzOEhIRTU1NgYGC4uLgrKysvz+kaAAAFuElEQVR4nO2diXbqOgxFCUkgzFMYeiljuZTy/v//HpShYdRRSGyrV/sDsnSWE1mWJaVQUBRFURRFURRFURRFURRFEmG53tiWmsUDzdK2Ph3btikjxtVae/E+7/a8K3rdebwY1quyhbaGk/61smvWnWHLtp2pCKbFmBL3Q785DWxbzGM83Ny8ls/52LQj21bDBI0BT92JyVbEQo5n83T69ixn7i/kcJ1e355u2+l1DIqvyTsw823reMh0lIVAzxu5un28ZaNvz1toW8wdKoztj2bu3jJus9S3p21b0SVBhm/oiZFTb+ome4E7iVXbss6EGfnQa7pl28qOhJn6mCS9qW1tB3JawT1LF17UIEeBOxxwN51cBXoD6xKb+Qr0vI5lgbW8BXpe06rAIDc3msDqkTGHUOaWkcUT49SEQJvvac4bxQ/WFjF3P3rijy2FpgR6K0uJ8Zkxhd5fKwLDd5aRq3k8WEw6i0E877IVdq1ENpxTfdzeJmLoqDH7Ykos2lAIL+H6s3rrDMMmyxG/W3Cn0w/QuPYDNxE0yHupBBaOUUPMss6z9O4M/yI/jQk7EWDZeyIcKcNx7cb4a1pGzFqRWU8fdTnmExp/EKsq9HP8CShxm7+mS5ArQsgoH7xKNX0SLi9pm8CsdRmT2M1X0A0t2qQNekkGeuVc9dzSpi2C07k+tmcY3hHpNP4X/jAshG/kp+YetEF1/GFlKDwyHJqS9gw4T4NC3GFeWu5C7/czzuOQzdXwQb9B2sM6ldcRhWYjU7Lmos8KI6EQ8C0vMXchtzBe2qGKKDQb1JAfDs/xRciOaDZX80mZw4uTIYVmv0Mym88rFqkioalZhdSl4QdwbkoAfYdmd4sFZQ5PIeRLHSuw4UFvrztKtq18BSimYQS67gHFpe7WZNJAm4XpE3CmQPcDfdtWvgKU35fsSrF6DvcKTmGwu/K5C/VfKQGSWjsWts1MDxSx2a4beoUI7M8Quxv6YHWx2QN+hqACxYZsESpwZNvSlKDfoNjNsITq8xZOd3s9IoCOTAccKWjnMWXUG9kuE06Dz6kY67vfdXlDmdVGa/haLQNCxhfoWSy9TE2L10drswY6FRFaXXJkLWzmgl9Eq+GOfLjS3AUS8UpSPWleJgDLShLICrhD9qSFnqwVbABVVJd0Za0gv3NhLSuU4W3yezbW2/JYMDdBz3T1zKvwe9mXsnwMv810IesNBVO+iQWUdhcKlKJeLqAsHwrntE/EvAoAF+BFMm1hX2CBk1DbMRF4wRQxxmKtRWZFGceJv/Je0B0+rE+gh/kG3go7wpIVJ+A2U7FlCFB18y6IEfqGFtCAtCcs25QEOtbHIn3oAahQZiVYIJS5cGbaVSrIanBP7O3uAaTYyc6whKwAukOXkj9CKGRjdUe5R0QKnAuN1U5USIXyLj8voSvwZaXtb6GP97YtfBVSYWzbwlchFZqf5pExpEJpmd8bSE8jOmLbQx4tpLtSuiNNvMIxpbBm28JXIeNSVeg8qlC+pwmKBNKuQhVFURRFURRFURRFURRFyZ1qqz04TizrT0oV2UU0twStr6vu7fdPgTX5jyndbU6fiC7YS/J4esJQWp/9fSpPmtNljmS54vm4QMnFwUdqxHiBjW0DXyX877lAwU0IR4DeWJHDg84gfzwQPCuwAPZvi15ERKDoLxH78RzvDwNugbQieE78szklPtj/K2y0QIKI3AwPyJoOkQRtUpc4be4ANCp/x8S2oalBFcrd81Wh/LcU+u2IJ3hAcGEM/n9TcG8XODhJcOgNzosQO6cbdTVyHc2OFaJQdNsM0sm9FHx4woZiCPake+gOy1iwn/mGHCUo/oImIMbmy/1nxZnnf90W7UfPPM4Kr8X3kxxpPYjAO7+onaR0m5Pqvf2aC9Jvgukw/vnvWG85KP2i9TsT1rbNfatTqfG7Vk9RFEVRFEVRFEVRFEVR/h3+B5xTSmn4+MLkAAAAAElFTkSuQmCC" ,
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

router.get('/pokemon/name', async (req, res) => {
  try {
    const { name } = req.query;
    // Buscar el nombre en la base de datos sin importar mayúsculas/minúsculas
    const dbPokemons = await Pokemon.findAll({
      where: {
        Nombre: {
          [Op.iLike]: `%${name}%`
        }
      },
      include: Type
    });

    // Si no se encontraron en la base de datos, buscar en la API
    if (dbPokemons.length === 0) {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
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

      res.json([apiPokemon]); // Devolver un arreglo para mantener consistencia con la respuesta
    } else {
      res.json(dbPokemons);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar el Pokémon por nombre' });
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