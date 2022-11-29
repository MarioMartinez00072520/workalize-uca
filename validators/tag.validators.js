const { body, param } = require("express-validator");
const validators = {};


validators.findTagByNameValidator = [
    param("name")
        .notEmpty().withMessage("El nombre de la etiqueta no puede ir vacio")
];

module.exports = validators;