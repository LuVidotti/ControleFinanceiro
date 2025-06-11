const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const verificaJwt = require("../auth");
const jwt = require("jsonwebtoken");
const SECRET = "segredo123";

//rota de criacao de conta
router.post("/", async (req, res) => {
    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
        return res.status(400).json({message: "Erro, nome invalido"});
    }

    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
        return res.status(400).json({message: "Erro, email invalido"});
    }

    if(!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null) {
        return res.status(400).json({message: "Erro, senha invalida"});
    }

    if(req.body.senha.length < 4) {
        return res.status(400).json({message: "Erro, senha curta demais"});
    }

    if(req.body.senha !== req.body.senha2) {
        return res.status(400).json({message: "Erro, as senhas devem coincidir"});
    }

    try {
        const emailJaExistente = await Usuario.findOne({email: req.body.email})
        if(emailJaExistente) {
            return res.status(400).json({message: "Erro, ja existe um usuario com este email"});
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.senha, salt);

        const novoUsuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: hash
        });

        const usuarioSalvo = await novoUsuario.save();

        return res.status(201).json({message: "Conta criada co msucesso!!!", usuarioSalvo:usuarioSalvo});
    } catch(erro) {
        return res.status(500).json({message: "Erro interno no servidor, erro: "+erro});
    }
    
})

//rota de login
router.post("/login", async (req,res) => {
    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
        return res.status(400).json({message: "Erro, email invalido"});
    }

    if(!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null) {
        return res.status(400).json({message: "Erro, senha invalida"});
    }

    try {
        const usuarioEncontrado = await Usuario.findOne({email: req.body.email});
        if(!usuarioEncontrado) {
            return res.status(404).json({message: "Erro, nenhum usuario encontrado com este email"});
        }

        const senhasBatem = await bcrypt.compare(req.body.senha, usuarioEncontrado.senha);
        if(!senhasBatem) {
            return res.status(400).json({message: "Erro, senha incorreta"});
        }

        const token = await jwt.sign({userId: usuarioEncontrado._id}, SECRET, {expiresIn: "1h"});
        return res.status(200).json({message: "Login realizado com sucesso!!!", token:token});
    } catch(erro) {
        return res.status(500).json({message: "Erro interno no servidor, erro: "+erro});
    }
})

module.exports = router;