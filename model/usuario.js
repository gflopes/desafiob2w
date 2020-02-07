const restful = require('node-restful')
const mongoose = restful.mongoose

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    max: 100,
    required: true,
  },
  nome: {
    type: String,
    max: 100,
    required: true,
  },
  senha: {
    type: String,
    min: 6,
    max: 12,
    required: true,
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
  data_ultimo_login: {
    type: Date,
    default: Date.now,
  },
})

module.exports = restful.model('Usuario', usuarioSchema)
