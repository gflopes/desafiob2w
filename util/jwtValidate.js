let jwt = require('jsonwebtoken')
const env = require('../.env')

let validateToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  } else {
    return res.status(400).json({
      message: 'É necessário efetuar o login para consumir os serviços da API',
    })
  }

  if (token) {
    jwt.verify(token, env.authSecret, err => {
      if (err) {
        return res.status(401).json({
          mensagem: 'Falha na autenticação do usuário',
        })
      } else {
        next()
      }
    })
  } else {
    return res.status(400).json({
      message: 'É necessário efetuar o login para consumir os serviços da API',
    })
  }
}

module.exports = {
  validateToken: validateToken,
}
