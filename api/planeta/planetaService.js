const fetch = require('node-fetch')

const Planeta = require('../../model/planeta')

const env = require('../../.env')

Planeta.methods(['get', 'post', 'delete'])

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
        res.status(500).json({
          mensagem: 'Erro ao adicionar um novo planeta',
        })
      } else if (planeta) {
        return res.status(400).json({
          mensagem: 'Planeta já cadastrado.',
        })
      } else {
        const newPlaneta = new Planeta({
          nome,
          clima,
          terreno,
        })
        newPlaneta.save(function(err, planeta) {
          if (err) {
            res.status(500).json({
              mensagem: err,
            })
          } else {
            return res.status(201).json({
              _id: planeta._id,
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
      return res.status(500).json({
        mensagem: 'Erro ao buscar o planeta',
      })
    }

    if (!planeta) {
      return res.status(404).json({
        mensagem: 'Planeta não encontrado',
      })
    }

    const { _id, nome, clima, terreno } = planeta
    let filmes = await getCountFilms(nome)
    filmes = filmes === undefined ? 0 : filmes
    return res.status(200).json({
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
      nome: req.query.valor,
    },
    async function(err, planeta) {
      if (err) {
        return res.status(500).json({
          mensagem: 'Erro ao buscar o planeta',
        })
      }

      if (!planeta) {
        return res.status(404).json({
          mensagem: 'Planeta não encontrado',
        })
      }

      const { _id, nome, clima, terreno } = planeta
      let filmes = await getCountFilms(nome)
      filmes = filmes === undefined ? 0 : filmes
      return res.status(200).json({
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
  try {
    Planeta.findByIdAndDelete(req.params.id, function(err) {
      if (err) {
        return res.status(404).json({
          mensagem: 'Planeta não encontrado',
        })
      }

      return res.status(200).json({
        mensagem: 'Planeta excluído com sucesso',
      })
    })
  } catch (err) {
    return res.status(500).json({
      mensagem: 'Erro ao excluir o planeta: ' + err,
    })
  }
}

const list = async (req, res) => {
  try {
    const query = {}
    const pageSize = 5
    const page = parseInt(req.query.page || 1)
    const skip = pageSize * (page - 1)

    let result = {}

    const [list, count] = await Promise.all([
      Planeta.find(query)
        .sort({ _id: 'asc' })
        .select('-__v')
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      Planeta.countDocuments({}),
    ])

    const totalPages = Math.ceil(count / pageSize)

    result = {
      count: count,
      totalPages: totalPages,
      page: page,
      nextPage: page < totalPages ? page + 1 : totalPages,
      data: [],
    }

    const promise = list.map(async planeta => {
      planeta.filmes = await getCountFilms(planeta.nome)
      planeta.filmes = (await planeta.filmes) === undefined ? 0 : planeta.filmes
      await result.data.push(planeta)
    })

    await Promise.all(promise)
    res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({
      mensagem: 'Erro ao listar os planetas cadastrados: ' + err,
    })
  }
}

async function getCountFilms(planeta) {
  let results = []
  let planet = {}

  do {
    const res = (await results.next)
      ? await fetch(results.next)
      : await fetch(env.URL_SWAPI + '/planets')

    if (res.status === 200) {
      const json = await res.json()
      results = await JSON.parse(JSON.stringify(json))

      results['results'].forEach(obj => {
        if (obj.name === planeta) {
          planet = {
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
