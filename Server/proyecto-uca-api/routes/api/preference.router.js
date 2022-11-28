const Express = require("express");
const router = Express.Router();
const ROLES = require("../../data/roles.constants.json")

const preferenceController =  require("../../controllers/preference.controller");

const preferenceValidators = require("../../validators/preference.validators");
const runValidations = require("../../validators/index.middleware");
const { authentication, authorization } =  require("../../middlewares/auth.middleware");



//Exclusivo para Admins
router.post("/",
    authentication,
    authorization(ROLES.ADMIN),
    preferenceValidators.createPreferenceValidator,
    runValidations,
    preferenceController.create
);

module.exports = router;