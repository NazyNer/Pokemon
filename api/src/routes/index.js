const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokemonRouter = require('./pokemon/index');
const typeRouter = require('./type/index');



const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use(pokemonRouter);
router.use(typeRouter)

module.exports = router;
