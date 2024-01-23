/* 
    Rutas de eventos / events
    host+ /api/events
*/
const {Router} = require('express');
const router = Router();
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const { getEventos,crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');


//Todas tienen que pasar po validacion jwt
router.use(validarJWT);

//obtener eventos
//tienen que estar validadas por el token
router.get('/',
            getEventos
);

//crear un nuevo eventos
//tienen que estar validadas por el token
router.post('/',
            [
                check('title','Titulo es obligatorio').not().isEmpty(),
                check('start','Fecha de inicio es obligatoria').custom(isDate),
                check('end','Fecha de finalizacion es obligatoria').custom(isDate),
                validarCampos
            ],
            crearEvento
);

//actualizar eventos
//tienen que estar validadas por el token
router.put('/:id',  
                [
                    check('title','Titulo es obligatorio').not().isEmpty(),
                    check('start','Fecha de inicio es obligatoria').custom(isDate),
                    check('end','Fecha de finalizacion es obligatoria').custom(isDate),
                    validarCampos
                ],
                actualizarEvento
);

//Borrar eventos
//tienen que estar validadas por el token
router.delete('/:id', 
                    eliminarEvento
);

module.exports = router;