const Mongoose = require("mongoose")
const Schema = Mongoose.Schema;

const PreferenceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }, 
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, 
{timestamps: true} );

module.exports = Mongoose.model("Preference", PreferenceSchema );