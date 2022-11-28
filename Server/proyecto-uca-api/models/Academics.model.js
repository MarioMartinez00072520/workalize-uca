const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const academicsSchema = new Schema({
    program: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = Mongoose.model("Academics", academicsSchema);