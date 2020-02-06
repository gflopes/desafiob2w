const server = require('./config/server.js')
require('./config/routes.js')(server)
require('./config/database.js')
module.exports = server
