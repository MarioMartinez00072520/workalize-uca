const jwt = require("jsonwebtoken");

const secret = process.env.TOKEN_SECRET || "SuperSecret";
const expTime = process.env.TOKEN_EXP || "15m";

const tools = {};

tools.createToken = (_id) => {
    return jwt.sign({ userId: _id}, secret, {expiresIn: expTime})
};

tools.verifyToken = (token) => {
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return false;
    }
};

module.exports = tools;