const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../../model/usuario')
const env = require('../../.env')

const emailRegex = /\S+@\S+\.\S+/

const sendErrorsFromDB = (res, dbErrors) => {
  const mensagem = []
  _.forIn(dbErrors.errors, error => mensagem.push(error.message))
  return res.status(400).json({
    mensagem,
  })
}

const login = (req, res) => {
  const email = req.body.email || ''
  const senha = req.body.senha || ''

  Usuario.findOne(
    {
      email,
    },
    (err, usuario) => {
      if (err) {
        return sendErrorsFromDB(res, err)
      } else if (usuario) {
        const token = jwt.sign(
          {
            email: email,
          },
          env.authSecret,
          {
            expiresIn: 604800,
          }
        )

        if (bcrypt.compareSync(senha, usuario.senha)) {
          const { email } = usuario

          usuario.data_ultimo_login = new Date()
          usuario.save(function(err) {
            if (err) {
              return res.status(500).send({
                mensagem:
                  'Erro na atualização da data de último login do usuário',
              })
            }
          })

          return res.json({
            email,
            token,
          })
        } else {
          return res.status(401).send({
            mensagem: 'Usuário e/ou Senha inválidos',
          })
        }
      } else {
        return res.status(404).send({
          mensagem: 'Usuário e/ou Senha inválidos',
        })
      }
    }
  )
}

const signup = (req, res, next) => {
  const email = req.body.email || ''
  const senha = req.body.senha || ''

  console.log('inclusao de novo usuario')

  if (!email.match(emailRegex)) {
    return res.status(400).send({
      mensagem: 'O e-mail informado está inválido',
    })
  }

  const salt = bcrypt.genSaltSync()
  const senhaHash = bcrypt.hashSync(senha, salt)

  console.log('email: ' + email)

  Usuario.findOne(
    {
      email,
    },
    (err, usuario) => {
      if (err) {
        return sendErrorsFromDB(res, err)
      } else if (usuario) {
        return res.status(400).send({
          mensagem: 'Email já existente.',
        })
      } else {
        const newUser = new Usuario({
          email,
          senha: senhaHash,
        })
        newUser.save(err => {
          if (err) {
            return sendErrorsFromDB(res, err)
          } else {
            login(req, res, next)
          }
        })
      }
    }
  )
}

module.exports = {
  login,
  signup,
}
