const { check, validationResult } = require('express-validator')

const validatePlaneta = (req, res, next) => {
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

const addPlanetaValidationRules = () => {
  return [
    check('nome')
      .not()
      .isEmpty()
      .withMessage('Informe o nome do planeta')
      .isLength({ max: 100 })
      .withMessage('Informe o nome do planeta com no máximo 100 caracteres'),
    check('clima')
      .not()
      .isEmpty()
      .withMessage('Informe o clima do planeta')
      .isLength({ max: 100 })
      .withMessage('Informe o clima do planeta com no máximo 100 caracteres'),
    check('terreno')
      .not()
      .isEmpty()
      .withMessage('Informe o terreno do planeta')
      .isLength({ max: 100 })
      .withMessage('Informe o terreno do planeta com no máximo 100 caracteres'),
  ]
}

module.exports = {
  addPlanetaValidationRules,
  validatePlaneta,
}
