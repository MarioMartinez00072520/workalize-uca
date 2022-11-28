const Preference =  require("../models/Preference.model");
const debug = require("debug")("app:preference-controller");

const controller = {};

controller.create = async (req, res) => {
    try {
        
        const { title, description, value} = req.body;

        const { _id: userId } = req.user;

        const preference = new Preference({
            title: title,
            description:  description,
            value: value,
            user: userId
        })

        const newPreference = await preference.save();

        if(!newPreference) return res.status(409).json({error: "Ocurrio un error al crear la preferencia."});

        return res.status(201).json(newPreference);

    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Error interno de servidor." });
    }
};

controller.findAll =  async (req, res) => {
    try {

    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Error interno de servidor." });
    }
}

module.exports = controller;