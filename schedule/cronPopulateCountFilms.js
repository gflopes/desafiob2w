const cron = require('node-cron')
const fetch = require('node-fetch')

const Planeta = require('../model/planeta')

const env = require('../.env')

function start() {
  cron.schedule('0 */1 * * *', async function() {
    let ts = new Date()
    console.log('Carga de Planetas - Inicio: ' + ts.toUTCString())

    let results = []
    let films = []

    do {
      const res = results.next
        ? await fetch(results.next)
        : await fetch(env.URL_SWAPI + '/planets')

      if (res.status === 200) {
        const json = await res.json()
        results = await JSON.parse(JSON.stringify(json))

        results['results'].forEach(obj => {
          let planet = {
            nome: obj.name,
            quantidade: obj.films.length,
          }

          films.push(planet)
        })
      }
    } while (results.next)

    console.log('films: ' + JSON.stringify(films))

    films.forEach(function(film) {
      const { nome, quantidade } = film

      Planeta.findOne(
        {
          nome,
        },
        (err, planeta) => {
          if (!err && planeta) {
            planeta.filmes = quantidade
            planeta.save(function(err) {
              if (!err) {
                return true
              }
            })
          }
        }
      )
    })

    console.log('Carga de Planetas - Termino: ' + ts.toUTCString())
  })
}

module.exports = {
  start,
}
