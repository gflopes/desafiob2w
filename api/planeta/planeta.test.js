const app = require('../../loader.js')
const request = require('supertest')

const planeta = require('../../model/planeta')

beforeAll(() => {
  planeta.deleteMany({}).exec()
})

describe('POST /planeta/add', function() {
  it('teste da rota de add planeta, status code esperado => 200', function(done) {
    request(app)
      .post('/api/planeta/add')
      .set(
        'authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlMUBlbWFpbC5jb20uYnIiLCJpYXQiOjE1ODEzNDgwMTMsImV4cCI6MTU4MTk1MjgxM30.EQ5VBRdp9eZbD_v83UsSAaEtC12mFRmuklseqrhspxI'
      )
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
