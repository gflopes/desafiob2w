const _ = require('lodash')
const request = require('request')
const Planeta = require('../../model/planeta')
const env = require('../../.env')

Planeta.methods(['get', 'post', 'put', 'delete'])
Planeta.updateOptions({
  new: true,
  runValidators: true,
})
Planeta.after('get', sendErrorsOrNext)

// tratamento de erros e parse das mensagens de erro devolvidos
function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if (bundle.errors) {
    var mensagem = parseErrors(bundle.errors)
    res.status(500).json({
      mensagem,
    })
  } else {
    next()
  }
}

function parseErrors(nodeRestfulErrors) {
  const mensagem = []
  _.forIn(nodeRestfulErrors, error => mensagem.push(error.message))
  return mensagem
}

async function getAparicoesFilme(planeta) {
  await request(env.URL_SWAPI + '/planets/?name=' + planeta, function(
    error,
    response,
    body
  ) {
    console.log('error:', error)
    console.log('statusCode:', response && response.statusCode)
    var retorno = JSON.parse(body)
    console.log('quantidade ' + retorno['count'])
    return retorno['count']
  })
}

const add = (req, res) => {
  const nome = req.body.nome || ''
  const clima = req.body.clima || ''
  const terreno = req.body.terreno || ''

  Planeta.findOne(
    {
      nome,
    },
    (err, planeta) => {
      if (err) {
        res.status(500).json({
          mensagem: err,
        })
      } else if (planeta) {
        return res.status(400).send({
          mensagem: 'Planeta já cadastrado.',
        })
      } else {
        const newPlaneta = new Planeta({
          nome,
          clima,
          terreno,
        })
        newPlaneta.save(err => {
          if (err) {
            res.status(500).json({
              mensagem: err,
            })
          } else {
            return res.status(200).send({
              mensagem: 'Planeta cadastrado com sucesso.',
            })
          }
        })
      }
    }
  )
}

const findById = (req, res) => {
  Planeta.findById(req.params.id, function(err, planeta) {
    if (err) {
      return res.status(500).send({
        mensagem: err,
      })
    }

    if (!planeta) {
      return res.status(500).send({
        mensagem: 'Planeta não encontrado',
      })
    }

    const { _id, nome, clima, terreno } = planeta

    let quantidadeAparicoes = getAparicoesFilme(nome)

    return res.status(200).json({
      _id,
      nome,
      clima,
      terreno,
      quantidadeAparicoes,
    })
  })
}

const findByName = (req, res) => {
  Planeta.findOne({ nome: req.query.name }, function(err, planeta) {
    if (err) {
      return res.status(500).send({
        mensagem: err,
      })
    }

    if (!planeta) {
      return res.status(500).send({
        mensagem: 'Planeta não encontrado',
      })
    }

    const { _id, nome, clima, terreno } = planeta

    let quantidadeAparicoes = getAparicoesFilme(nome)

    return res.status(200).json({
      _id,
      nome,
      clima,
      terreno,
      quantidadeAparicoes,
    })
  })
}

const deletePlaneta = (req, res) => {
  Planeta.findOneAndDelete(req.params.id, function(err) {
    if (err) {
      return res.status(500).send({
        mensagem: err,
      })
    }

    return res.status(200).json({
      mensagem: 'Planeta excluído com sucesso',
    })
  })
}

module.exports = {
  add,
  findById,
  findByName,
  deletePlaneta,
}
