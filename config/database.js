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
  : 'mongodb://localhost:27017/db_desafio_bw2'

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

module.exports = mongoose
