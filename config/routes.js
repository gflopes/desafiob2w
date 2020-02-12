const express = require('express')
const jwtValidate = require('../util/jwtValidate')

module.exports = function(server) {
  const api = express.Router()
  server.use('/api', api)

  const AuthService = require('../api/usuario/authService')
  const PlanetaService = require('../api/planeta/planetaService')

  api.post('/login', AuthService.login)
  api.post('/signup', AuthService.signup)

  api.post('/planetas', jwtValidate.validateToken, PlanetaService.add)
  api.get('/planetas/:id', jwtValidate.validateToken, PlanetaService.findById)
  api.post(
    '/planetas/busca/nome',
    jwtValidate.validateToken,
    PlanetaService.findByName
  )
  api.get('/planetas', jwtValidate.validateToken, PlanetaService.list)
  api.delete(
    '/planetas/:id',
    jwtValidate.validateToken,
    PlanetaService.deletePlaneta
  )
}
