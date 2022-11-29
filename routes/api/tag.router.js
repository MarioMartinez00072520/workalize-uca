const express = require("express");
const router = express.Router();

const ROLES = require("../../data/roles.constants")

const tagController = require("../../controllers/tag.controller");
const tagValidators = require("../../validators/tag.validators");
const runValidations = require("../../validators/index.middleware");
const { authentication, authorization } =  require("../../middlewares/auth.middleware");

router.post("/",
    authentication,
    authorization(ROLES.ADMIN),
    tagValidators.createTagValidator,
    runValidations,
    tagController.create
);

module.exports = router;