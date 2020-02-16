const porta = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')
const allowCors = require('./cors')
const queryParser = require('express-query-int')
const addRequestId = require('express-request-id')()
const path = require('path')
const rfs = require('rotating-file-stream')
const morgan = require('morgan')

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
app.use(addRequestId)

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, '../log'),
})

app.use(morgan('combined', { stream: accessLogStream }))

morgan.token('id', function getId(req) {
  return req.id
})

var loggerFormat = ':id [:date[web]] ":method :url" :status :response-time'

app.use(
  morgan(loggerFormat, {
    skip: function(req, res) {
      return res.statusCode < 400
    },
    stream: process.stderr,
  })
)

app.use(
  morgan(loggerFormat, {
    skip: function(req, res) {
      return res.statusCode >= 400
    },
    stream: process.stdout,
  })
)

app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerDocument))

app.listen(porta, host, function() {
  console.log(`API Desafio está rodando na porta ${porta}.`)
})

module.exports = app
