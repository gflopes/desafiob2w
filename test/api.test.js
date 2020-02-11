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

  it('signup usuario', function(done) {
    request(app)
      .post('/api/signup')
      .send({
        email: 'teste1@email.com.br',
        senha: 'Teste1$',
        nome: 'teste1',
      })
      .expect(200)
      .end(function(err) {
        if (err) return done(err)
        done()
      })
  })

  it('login usuario', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'teste1@email.com.br',
        senha: 'Teste1$',
      })
    token = res.body.token
    expect(res.statusCode).toEqual(200)
  })

  it('add planeta', function(done) {
    request(app)
      .post('/api/planeta/add')
      .set('Authorization', 'Bearer ' + token)
      .send({
        nome: 'Teste',
        clima: 'Quente',
        terreno: 'Rochoso',
      })
      .expect(200)
      .end(function(err) {
        if (err) return done(err)
        done()
      })
  })
})
