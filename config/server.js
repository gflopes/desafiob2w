const porta = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')
const allowCors = require('./cors')
const queryParser = require('express-query-int')
const morgan = require('morgan')
const cronPopulateCountFilms = require('../schedule/cronPopulateCountFilms')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

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
app.use(morgan('combined'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

cronPopulateCountFilms.start()

app.listen(porta, host, function() {
  console.log(`API Desafio está rodando na porta ${porta}.`)
})

module.exports = app
