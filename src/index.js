const express = require('express')

const app = express()

app.use(express.json())

//Para entender quando passarmos parametros via url para ele decodar
app.use(express.urlencoded({ extended: false }))

//Passando o app no fim para que o authcontroller tambem tenha o app
require('./controllers/authController')(app)

app.listen(3000)