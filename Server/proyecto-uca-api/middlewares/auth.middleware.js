const { verifyToken } = require("../utils/jwt.tools");
const debug = require("debug")("app:auth-middleware");

const User =  require("../models/User.model");
const ROLES = require("../data/roles.constants")
const middlewares = {};

const tokenPrefix = "Bearer";

middlewares.authentication = async (req, res, next) => {
    try {
        //Paso 1: Verificar que authorization exista
        const { authorization } = req.headers;

        if(!authorization) return res.status(401).json({error: "No autorizado"});


        //Paso 2: Verificar que token sea valido
        const [prefix, token] = authorization.split(" ");

        if(prefix !=  tokenPrefix) return res.status(401).json({error: "No autorizado"});

        if(!token) return res.status(401).json({error: "No autorizado"});

        const tokenObject = verifyToken(token);

        if(!tokenObject) return res.status(401).json({error: "No autorizado"});

        const { userId } = tokenObject;
        debug(userId);
        
        //Paso 3: Obtener al usuario

        const user = await User.findById(userId);

        if(!user) return res.status(401).json({error: "No autorizado"});

        //Paso 4: Token registrado
        const isTokenValid = user.tokens.includes(token);

        if(!isTokenValid) return res.status(401).json({error: "No autorizado"});

        //Paso 5: Modificar la req para tener la info del usuario
        req.user = user;
        req.token = token;


        //Paso 6: Pasar al siguiente middleware
        next();
    } catch (error) {
        debug({error})
        return res.status(500).json({error: "Error inesperado de servidor"});
    }
}

middlewares.authorization = (roleRequired=ROLES.SYSADMIN) => {
    return (req, res, next) => {
        //Paso 0: Asumir que se ejecuta despues del proceso de autenticacion

        const { roles=[] } = req.user;
        //Paso 1: Verificar si el rol existe en el arreglo

        const roleIndex = roles.findIndex(role => (role == roleRequired || role == ROLES.SYSADMIN));

        //Paso 2: realizar el filtro del rol
        if(roleIndex < 0 ) return res.status(403).json({error: "Acceso Prohibido"});

        //Paso 3: Pasar al siguiente middleware
        next();
    }
}

module.exports = middlewares;