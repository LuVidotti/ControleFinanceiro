const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Gasto = new Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: false
    },
    data: {
        type: Date,
        required: true
    }
});

mongoose.model("gastos", Gasto);