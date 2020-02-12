const app = require('../loader.js')

const request = require('supertest')

const usuario = require('../model/usuario')
const planeta = require('../model/planeta')

beforeAll(async () => {
  await usuario.deleteMany({}).exec()
  await planeta.deleteMany({}).exec()
})

describe('Testes - API Planetas', function() {
  let token = ''
  let idPlaneta = ''
  let nomePlaneta = ''

  it('/POST signup usuario', function(done) {
    request(app)
      .post('/api/signup')
      .send({
        email: 'teste1@email.com.br',
        senha: 'Teste1$',
        nome: 'teste1',
      })
      .expect(201)
      .end(function(err) {
        if (err) return done(err)
        done()
      })
  })

  it('/POST login usuario', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'teste1@email.com.br',
        senha: 'Teste1$',
      })
    token = res.body.token
    expect(res.statusCode).toEqual(200)
  })

  it('/POST add planeta', async () => {
    const res = await request(app)
      .post('/api/planetas')
      .set('Authorization', 'Bearer ' + token)
      .send({
        nome: 'Teste',
        clima: 'Teste',
        terreno: 'Teste',
      })
    idPlaneta = res.body._id
    expect(res.statusCode).toEqual(201)
  })

  it('/GET find planeta by id', async () => {
    const res = await request(app)
      .get('/api/planetas/' + idPlaneta)
      .set('Authorization', 'Bearer ' + token)
    nomePlaneta = res.body.nome
    expect(res.statusCode).toEqual(200)
  })

  it('/GET find planeta by name', async () => {
    const res = await request(app)
      .post('/api/planetas/busca/nome/?valor=' + nomePlaneta)
      .set('Authorization', 'Bearer ' + token)
    expect(res.statusCode).toEqual(200)
  })

  it('/GET list planeta', async () => {
    const res = await request(app)
      .get('/api/planetas')
      .set('Authorization', 'Bearer ' + token)
    expect(res.statusCode).toEqual(200)
  })

  it('/DELETE remove planeta', async () => {
    const res = await request(app)
      .delete('/api/planetas/' + idPlaneta)
      .set('Authorization', 'Bearer ' + token)
    expect(res.statusCode).toEqual(200)
  })
})
