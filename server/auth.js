const mongoose = require("mongoose");
require("./models/Usuario");
const Usuario = mongoose.model("usuarios");
const SECRET = "segredo123";
const jwt = require("jsonwebtoken");

async function verificaJwt(req, res, next) {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(404).json({message: "Faca login novamente"});
    }

    try {
        const decoded = await jwt.verify(token, SECRET);

        const usuario = await Usuario.findOne({_id: decoded.userId});
        if(!usuario) {
            return res.status(404).json({message: "Erro ao buscar usuario"});
        }

        req.user = usuario;
        next()
    } catch(erro) {
        return res.status(500).json({message: "Erro ao verificar login"});
    }
}

module.exports = verificaJwt;