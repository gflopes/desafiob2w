const restful = require('node-restful')
const mongoose = restful.mongoose

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

module.exports = restful.model('Planeta', planetaSchema)