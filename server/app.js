const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = 3001;

//config
    //mongoose
    mongoose.connect(`mongodb+srv://luisfelipealmeida66:pcDoga60eU91PEZw@cluster0.czphpdu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
        console.log("Conectado ao banco de dados com sucesso!!!");
    }).catch((erro) => {
        console.log("Erro ao se conectar ao banco de dados, erro: "+erro);
    })

    //body-parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

//server
app.listen(PORT, () => {
    console.log("Servidor rodando na porta "+PORT);
});
