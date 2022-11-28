const {body, param} = require("express-validator");

const validators = {};

validators.createPreferenceValidator = [
    body("title")
      .notEmpty().withMessage("El título no debe de ser vacío.")
  ];

module.exports = validators;