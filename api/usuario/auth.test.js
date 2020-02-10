const app = require('../../loader.js')
const request = require('supertest')

const usuario = require('../../model/usuario')

beforeAll(() => {
  usuario.deleteMany({}).exec()
})

describe('POST /signup', function() {
  it('teste da rota de signup, usuario criado, status code esperado => 200', function(done) {
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
})

describe('POST /login', function() {
  it('teste da rota de login, login OK, status code esperado => 200', function(done) {
    request(app)
      .post('/api/login')
      .send({
        email: 'teste1@email.com.br',
        senha: 'Teste1$',
      })
      .expect(200)
      .end(function(err) {
        if (err) return done(err)
        done()
      })
  })
})
