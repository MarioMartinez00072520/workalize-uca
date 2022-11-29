const express = require("express");
const router = express.Router();

const ROLES = require("../../data/roles.constants")

const postController = require("../../controllers/post.controller");

const postValidators = require("../../validators/post.validators");
const runValidations = require("../../validators/index.middleware");

const { authentication, authorization } =  require("../../middlewares/auth.middleware");

// Paso1: String de la ruta 
// Paso2: Autenticacion, Autorizacion
// Paso3: Validators
// Paso4: run validators
// Paso5: controller method

//Esto es para cuando entras a la pagina de search, despliega todos los posts de proyectos visibles
router.get("/", postController.findAll);

router.get("/keyword/:keyword",
    postValidators.findPostByKeywordValidator,
    runValidations,
    postController.findPostsByKeyword);

// Cosas del usuario
// Desplegar todos los posts de proyectos que he guardado
router.get("/saved", authentication, postController.getOwnSavedPosts );

// Dar o quitar Like al post de un proyecto
// Like es mas del lado de post
router.patch("/like/:identifier",
    authentication,
    authorization(ROLES.USER),
    postValidators.findPostByIdValidator,
    runValidations,
    postController.togglePostLike
);

// Agregar o quitar post a la lista de guardados
// Save estan vinculados al usuario
router.patch("/save/:identifier",
    authentication,
    authorization(ROLES.USER),
    postValidators.findPostByIdValidator,
    runValidations,
    postController.toggleSavedPost
);

router.patch("/tag/:name/:identifier",
    authentication,
    authorization(ROLES.ADMIN),
    postValidators.findPostByIdValidator,
    runValidations,
    postController.toggleTaggedPost
);

// ruta para buscar posts de proyecto insertados por trabajadores
// ESTE NO ES BUSCAR POR CONTRATISTA

// AUTENTICADO =  TENGA CUENTA
// AUTORIZADO = TENGA CUENTA ADECUADA A LA QUERY

router.get("/own", authentication, postController.findOwn );
router.get("/user/:identifier",
    postValidators.findPostByIdValidator,
    runValidations,
    postController.findPostsByUser
);
//Este puede servir para darle share a otra red social o en general ya que es publico
router.get("/:identifier",
    postValidators.findPostByIdValidator,
    runValidations,
    postController.findOneById
);

// url/post/6382ac5cf5536d132331a62e

// Exclusivo de Admins
// Crear post de proyecto
router.post("/",
    authentication,
    authorization(ROLES.ADMIN),
    postValidators.createPostValidator,
    runValidations,
    postController.create
);

//Dar o quitarle visibilidad
router.patch("/visibility/:identifier",
    authentication,
    authorization(ROLES.ADMIN),
    postValidators.findPostByIdValidator,
    runValidations,
    postController.togglePostVisibility
);

module.exports = router;