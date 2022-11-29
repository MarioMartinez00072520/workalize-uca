const Mongoose = require("mongoose");

const Schema =  Mongoose.Schema;
const debug = require("debug")("app:tag-model");

const tagSchema =  new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    taggedPosts: {
        type: [Schema.Types.ObjectId],
        ref: "Post",
        require: true
    }

}, { timestamps: true})


module.exports = Mongoose.model("Tag", tagSchema);
