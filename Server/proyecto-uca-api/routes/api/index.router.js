const Express = require("express");
const router = Express.Router();


//Importar todos los enrutadores
const postRouter = require("./post.router");
const authRouter = require("./auth.router");
const preferenceRouter = require("./preference.router");

//Definir las rutas
router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/preference", preferenceRouter);

module.exports = router;