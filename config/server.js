const porta = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')
const allowCors = require('./cors')
const queryParser = require('express-query-int')
const fs = require('fs')
const morgan = require('morgan')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
  flags: 'a',
})

const app = express()

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())
app.use(allowCors)
app.use(queryParser())
app.use(helmet())
app.disable('x-powered-by')
app.use(morgan('combined', { stream: accessLogStream }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(porta, host, function() {
  console.log(`API Desafio está rodando na porta ${porta}.`)
})

module.exports = app
