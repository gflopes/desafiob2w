const { check, validationResult } = require('express-validator')
const loginValidationRules = () => {
  return [
    check('email')
      .not()
      .isEmpty()
      .withMessage('Informe o e-mail'),
    check('senha')
      .not()
      .isEmpty()
      .withMessage('Informe a senha de acesso'),
  ]
}

const signupValidationRules = () => {
  return [
    check('email')
      .not()
      .isEmpty()
      .withMessage('Informe o e-mail')
      .isLength({ max: 100 })
      .withMessage('Informe o email com no máximo 100 caracteres'),
    check('nome')
      .not()
      .isEmpty()
      .withMessage('Informe o nome do usuário')
      .isLength({ max: 100 })
      .withMessage('Informe o nome com no máximo 100 caracteres'),
    check('senha')
      .not()
      .isEmpty()
      .withMessage('Informe a senha de acesso')
      .isLength({ min: 6, max: 20 })
      .withMessage('A senha deve conter no mínimo 6 e no máximo 20 caracteres'),
  ]
}

const validateUsuario = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(400).json({
    errors: extractedErrors,
  })
}

module.exports = {
  loginValidationRules,
  signupValidationRules,
  validateUsuario,
}
