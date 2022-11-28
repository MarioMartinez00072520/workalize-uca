const {body} = require("express-validator");

const validators = { };

const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})/

validators.registerValidator = [
    body("username")
        .notEmpty().withMessage("El Username no debe estar vacio")
        .isLength({min: 4, max: 32}).withMessage("El Username debe tener entre 4 y 32 caracteres"),
    body("email")
        .notEmpty().withMessage("El email no debe estar vacio.")
        .isEmail().withMessage("El email que se ingreso no es una direccion valida."),
    body("password")
        .notEmpty().withMessage("La contrasena no debe de ir vacia")
        .matches(passwordRegexp).withMessage("La contrasena debe tener entre 8 y 32 caracteres, y al menos 1 letra minuscula, 1 letra mayuscula, 1 numero")
    ];

module.exports = validators;