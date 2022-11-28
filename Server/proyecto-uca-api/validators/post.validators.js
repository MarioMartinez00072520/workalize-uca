const { body, param } = require("express-validator");
const validators = {};

validators.createPostValidator = [
  body("title")
    .notEmpty().withMessage("El título no debe de ser vacío."),
  body("description")
    .notEmpty().withMessage("La descripción no debe de ser vacía.")
    .isLength({ max: 280 }).withMessage("La descripción no debe superar los 240 caracteres."),
  body("employer")
    .notEmpty().withMessage("El post debe ir con un contratista asignado.")
    .isLength({max: 64}).withMessage("El nombre del contratista no debe superar los 64 caracteres.")
];

validators.findPostByIdValidator = [
  param("identifier")
    .notEmpty().withMessage("El id no debe de ir vacío")
    .isMongoId().withMessage("El id debe de ser de mongo")
]

validators.findPostByKeywordValidator = [
  param("keyword")
    .notEmpty().withMessage("Tu busqueda no puede estar vacia. ")
]

module.exports = validators;