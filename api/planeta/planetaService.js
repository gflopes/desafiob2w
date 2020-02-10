const _ = require('lodash')
const fetch = require('node-fetch')

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
    res.status(500).send({
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

const add = (req, res) => {
  const nome = req.body.nome || ''
  const clima = req.body.clima || ''
  const terreno = req.body.terreno || ''

  Planeta.findOne(
    {
      nome,
    },
    function(err, planeta) {
      if (err) {
        res.status(500).send({
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
            res.status(500).send({
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
  Planeta.findById(req.params.id, async function(err, planeta) {
    if (err) {
      return res.status(500).send({
        mensagem: err,
      })
    }

    if (!planeta) {
      return res.status(404).send({
        mensagem: 'Planeta não encontrado',
      })
    }

    const { _id, nome, clima, terreno } = planeta
    const filmes = await getCountFilms(nome)
    return res.status(200).send({
      _id,
      nome,
      clima,
      terreno,
      filmes,
    })
  })
}

const findByName = (req, res) => {
  Planeta.findOne(
    {
      nome: req.query.name,
    },
    async function(err, planeta) {
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
      const filmes = await getCountFilms(nome)
      return res.status(200).send({
        _id,
        nome,
        clima,
        terreno,
        filmes,
      })
    }
  )
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

const list = async (req, res) => {
  const query = {}
  const pageSize = 5
  const page = parseInt(req.query.page || 1)
  const skip = pageSize * (page - 1)

  Planeta.find(query)
    .skip(skip)
    .limit(pageSize)
    .exec(async function(err, result) {
      if (err) {
        res.status(500).send({
          mensagem: 'Erro ao listar os planetas cadastrados',
        })
      }
      let planetas = []
      result.forEach(
        await function(planeta) {
          const filmes = getCountFilms(planeta.nome)
          planeta.filmes = filmes
          planetas.push(planeta)
        }
      )
      res.status(200).send(planetas)
    })
}

async function getCountFilms(planeta) {
  let results = []
  let planet = {}

  do {
    const res = results.next
      ? await fetch(results.next)
      : await fetch(env.URL_SWAPI + '/planets')

    if (res.status === 200) {
      const json = await res.json()
      results = await JSON.parse(JSON.stringify(json))

      results['results'].forEach(obj => {
        if (obj.name === planeta) {
          planet = {
            name: obj.name,
            films: obj.films.length,
          }
          return true
        }
      })

      if (planet) {
        return planet.films
      }
    }
  } while (results.next)
}

module.exports = {
  add,
  findById,
  findByName,
  list,
  deletePlaneta,
}
