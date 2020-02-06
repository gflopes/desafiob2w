const porta = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')
const allowCors = require('./cors')
const queryParser = require('express-query-int')
const server = express()

server.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
server.use(bodyParser.json())
server.use(allowCors)
server.use(queryParser())
server.use(helmet())
server.disable('x-powered-by')

server.listen(porta, host, function() {
  console.log(`API Desafio está rodando na porta ${porta}.`)
})

module.exports = server
