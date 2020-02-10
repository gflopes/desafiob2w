const express = require('express')
const jwtValidate = require('../util/jwtValidate')

module.exports = function(server) {
  const api = express.Router()
  server.use('/api', api)

  api.get('/', function(req, res) {
    res.json({
      mensagem: 'Seja Bem-Vindo a API Desafio',
    })
  })

  const AuthService = require('../api/usuario/authService')
  const PlanetaService = require('../api/planeta/planetaService')

  api.post('/login', AuthService.login)
  api.post('/signup', AuthService.signup)

  api.post('/planeta/add', jwtValidate.validateToken, PlanetaService.add)
  api.get('/planeta/:id', jwtValidate.validateToken, PlanetaService.findById)
  api.get('/planeta', jwtValidate.validateToken, PlanetaService.findByName)
  api.get('/planetas', jwtValidate.validateToken, PlanetaService.list)
  api.delete(
    '/planeta/:id',
    jwtValidate.validateToken,
    PlanetaService.deletePlaneta
  )
}
