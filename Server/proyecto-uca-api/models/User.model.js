const Mongoose =  require("mongoose");

const Schema =  Mongoose.Schema;

const debug = require("debug")("app:user-model");
const crypto = require("crypto");
// email, user, password, roles, lo que necesitemos etc
//preferencias {modalidad, }

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        name: {
            type: String,
            default: ""
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        carnet: {
            type: String,
            trim: true,
        }
        ,
        hashedPassword: {
            type: String,
            required: true
        },
        
        salt: {
            type: String
        },

        tokens: {
            type: [String],
            default: []
        },

        roles: {
            type: [String],
            default: []
        },
        savedPosts: {
            type: [Schema.Types.ObjectId],
            ref: "Post",
            default: []
        },
        preferences: {
            area:{
                type: String,
                default: ""
            },
            availability: {
                type: String,
                default: ""
            },
            location: {
                type: String,
                default: ""
            },
            salary: {
                type: Number,
                default: 0
            }
        }
    },
    { timestamps: true }
);

userSchema.methods = {
    encryptPassword: function (password){

        if(!password) return "";

        try {
            const encryptedPassword = crypto.pbkdf2Sync(
                password,
                this.salt,
                1000, 64,
                `sha512`
            ).toString("hex");

            return encryptedPassword;
        } catch (error) {
            debug({ error });
            return "";
        };
    },
    
    makeSalt: function (){
        return crypto.randomBytes(16).toString("hex")
    },

    comparePassword: function (password){
        return this.hashedPassword === this.encryptPassword(password);
    }
};

userSchema.virtual("password")
  .set(function (password = crypto.randomBytes(16).toString()) {
    if (!password) return;

    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
//atributo o objeto virtual
module.exports = Mongoose.model("User", userSchema);