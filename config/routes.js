const express = require('express')
const {
  loginValidationRules,
  signupValidationRules,
  validateUsuario,
} = require('../util/validatorUsuarioInput.js')

const {
  addPlanetaValidationRules,
  validatePlaneta,
} = require('../util/validatorPlanetaInput.js')

const jwtValidate = require('../util/jwtValidate')

module.exports = function(server) {
  const api = express.Router()
  server.use('/api', api)

  const UsuarioService = require('../api/usuario/usuarioService')
  const PlanetaService = require('../api/planeta/planetaService')

  api.post(
    '/login',
    loginValidationRules(),
    validateUsuario,
    UsuarioService.login
  )
  api.post(
    '/signup',
    signupValidationRules(),
    validateUsuario,
    UsuarioService.signup
  )

  api.post(
    '/planetas',
    jwtValidate.validateToken,
    addPlanetaValidationRules(),
    validatePlaneta,
    PlanetaService.add
  )
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
