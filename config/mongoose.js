const Mongoose = require("mongoose");
const debug = require("debug")("app:mongoose");


const dbhost = process.env.DBHOST || "localhost";
const dbport = process.env.DBPORT || "27017";
const dbname = process.env.DBNAME || "workalize-uca";

// URI de MongoDB Atlas
// mongodb+srv://sysadmin:WorkalizeUCA2022@cluster0.zamdabm.mongodb.net/test
// `mongodb+srv://${dbuser}:{dbpassword}`

const dburi = process.env.DBURI;


const connect = async () => {
    debug(dburi)
    try {
        await Mongoose.connect(dburi);
        debug("Conexion exitosa!")
    } catch (error) {
        debug("Error en la conexion de la base");
        process.exit(1);
    }
}

module.exports = {
    connect
}
