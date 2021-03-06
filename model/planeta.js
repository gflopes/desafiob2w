const restful = require('node-restful')
const mongoose = restful.mongoose
const mongoosePaginate = require('mongoose-paginate-v2')

const planetaSchema = new mongoose.Schema({
  nome: {
    type: String,
    max: 100,
    required: true,
  },
  clima: {
    type: String,
    max: 100,
    required: true,
  },
  terreno: {
    type: String,
    max: 100,
    required: true,
  },
})

planetaSchema.plugin(mongoosePaginate)

module.exports = restful.model('Planeta', planetaSchema)
