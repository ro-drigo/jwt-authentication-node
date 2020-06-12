const express = require('express')
//buscando nossa tabela usuário
const User = require('../models/user')

//Router para definir rotas só para usuários
const router = express.Router()

//rota para cadastro de usuário
router.post('/register', async (req, res) => {
    try{

        const user = await User.create(req.body)
        return res.send({ user })

    }catch (err){

        return res.status(400).send({ error: 'Registration Failed' })
    
    }
})

//o /auth estará prefixada antes das outras rotas feitas no controller
module.exports = app => app.use('/auth', router)
