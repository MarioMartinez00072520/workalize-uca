const { body, param } = require("express-validator");
const validators = {};

validators.createTagValidator = [
    body("name")
        .isEmpty().withMessage("El nombre de la etiqueta no puede ir vacio")
        .isLength({max: 16}).withMessage("El nombre de la etiqueta no debe exceder los 16 caracteres.")
];

validators.findTagByNameValidator = [
    param("name")
        .notEmpty().withMessage("El nombre de la etiqueta no puede ir vacio")
];

module.exports = validators;