const User = require("../models/User.model");
const debug = require("debug")("app:auth-controller");
const {createToken, verifyToken} = require("../utils/jwt.tools");
const ROLES = require("../data/roles.constants");

const controller = {};

controller.register = async (req, res) => {
  try {
      //Paso1: Obtener datos del usuario: Req -> Body

      const { email, name, username, carnet, password } = req.body;
      //Paso2: Verificar que  el username o email esten libres

      const user = await User.findOne({ $or: [ {username: username}, { email: email} ] } );

      if(user){
          return res.status(409).json({error: "Este usuario ya existe en la base de datos."})
      }


      //Paso3: Encriptar contra
      //Ir a metodos
      //Paso4: Guardar User

      const newUser = new User({
          username: username,
          name: name,
          email: email,
          carnet: carnet,
          password: password,
          roles: [ROLES.USER]
      });

      await newUser.save();

      res.status(201).json({ message: "Usuario creado con exito!"})
  } 
  catch (error) {
    debug({error});
    return res.status(500).json({error: "Error inesperado de servidor."})
  }
}

controller.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    //Paso 01: Verificar si el usuario existe
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

    if (!user) {
      return res.status(404).json({ error: "El usuario no existe" });
    }

    //Paso 02: Comparar las contraseñas
    if (!user.comparePassword(password)) {
      return res.status(401).json({ error: "Contraseña no coincide" });
    }

    //Paso 03: Loggearlo
    const token = createToken(user._id);
    user.tokens = [token, ...user.tokens.filter(_token => verifyToken(_token)).splice(0, 4)];

    await user.save();

    //Paso 04: Registrar los tokens de usuario

    return res.status(200).json({ token: token });
  } catch (error) {
    debug(error);
    return res.status(500).json({ error: "Error inesperado del servidor." })
  }
}

controller.whoami = async (req, res) => {
  try {
    const { _id, email, name,  username, carnet, organization, preferences, roles } = req.user;

    return res.status(200).json({ _id, email, name,  username, carnet, organization, preferences, roles });

  } catch (error) {
    debug(error);
    return res.status(500).json({ error: "Error inesperado del servidor." })
  }
}

controller.updatePreferences = async (req, res) => {
  try {
    
    const { area, availability, location, salary } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id);

    user.preferences.area = area || "No preference. ";
    user.preferences.availability = availability || "No preference. ";
    user.preferences.location = location || "No preference. ";
    user.preferences.salary = salary || "No preference. ";

    await user.save();

    return res.status(200).json({ message: "Los cambios han sido exitosos. "})

  } catch (error) {
    debug(error);
    return res.status(500).json({ error: "Error inesperado del servidor." })
  }
}

module.exports =  controller;