const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Op } = require('sequelize');
const { Type } = require('../../db');

// Ruta para obtener todos los tipos de pokémon
router.get('/types', async (req, res) => {
  try {
    // Verificar si ya existen tipos en la base de datos
    const typesFromDB = await Type.findAll();
    // Si ya existen tipos en la base de datos, los retornamos directamente
    if (typesFromDB.length > 0) {
      const types = typesFromDB.map((type) => type.nombre);
      res.json(types);
      return;
    }
    // Si no hay tipos en la base de datos, los obtenemos desde la API externa
    const response = await axios.get('https://pokeapi.co/api/v2/type');
    const typesFromAPI = response.data.results.map((type) => type.name);
    // Guardamos los tipos en la base de datos
    for (const type of typesFromAPI) {
      await Type.findOrCreate({
        where: { nombre: type },
        defaults: { nombre: type } // Solo se utilizará si no se encuentra ningún registro con el nombre dado
      });
    }
    res.json(typesFromAPI);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;