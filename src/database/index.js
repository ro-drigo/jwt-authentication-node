const mongoose = require('mongoose')

mongoose.Promise = global.Promise

//fazendo a conexão
mongoose.connect('mongodb://localhost/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

module.exports = mongoose
