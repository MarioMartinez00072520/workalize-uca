const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  requirements: {
    type: String,
    trim: true,
    default: "There are no requirements."
  },
  employer: {
    type: String,
    trim: true,
    required: true
  },
  level: {
    type: String,
    trim: true,
    default: "Not specified. "
  },
  location: {
    type: String,
    default: "Not specified. "
  },
  hidden: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: []
  }
}, { timestamps: true });

module.exports = Mongoose.model("Post", PostSchema);