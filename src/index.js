const express = require('express')

const app = express()

app.use(express.json())

//Para entender quando passarmos parametros via url para ele decodar
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('ok')
})


app.listen(3000)