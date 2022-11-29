const Tag = require("../models/Post.model");
const User = require("../models/User.model")
const debug = require("debug")("app:post-controller");

const controller = {};

controller.create = async (req,res) => {
    try {
        const {name} = req.body;
        const {_id: userId} = req.user;

        const _tag = await tag.findOne({ name: name });

        if(_tag){
            return res.status(409).json({error: "Este usuario ya existe en la base de datos."})
        }
        
        const tag = new Tag({
            name: name,
            user: userId
        })

        const newTag = await tag.save();

        if(!newTag) return res.status(409).json({ error: "Error al crear una nueva etiqueta"})

        return res.status(201).json({message: "Se ha agregado una nueva etiqueta."})
    } catch (error) {
        debug({error});
    return res.status(500).json({error: "Error inesperado de servidor."})
    }
}

module.exports = controller;