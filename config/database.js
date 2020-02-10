const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  poolSize: 5,
}

const url = process.env.MONGOLAB_URI
  ? process.env.MONGOLAB_URI
  : 'mongodb://localhost:27017/db_desafio_bw2' // 'mongodb://desafio-nodejs:accenture2019@ds353378.mlab.com:53378/heroku_drz5zhx6'

mongoose.connect(url, options)

mongoose.connection.on('error', err => {
  console.log('Erro na conexão com o banco de dados: ' + err)
})

mongoose.connection.on('disconnected', () => {
  console.log('API Desafio desconectada do banco de dados')
})

mongoose.connection.on('connected', () => {
  console.log('API Desafio conectada do banco de dados')
})

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório."
mongoose.Error.messages.Number.min =
  "O '{VALUE}' informado é menor que o limite mínimo de '{MIN}'."
mongoose.Error.messages.Number.max =
  "O '{VALUE}' informado é maior que o limite máximo de '{MAX}'."
mongoose.Error.messages.String.enum =
  "'{VALUE}' não é válido para o atributo '{PATH}'."

module.exports = mongoose
