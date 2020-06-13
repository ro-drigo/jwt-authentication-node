const express = require('express')
//buscando nossa tabela usuário
const User = require('../models/user')
const bcrypt = require('bcryptjs')

//Router para definir rotas só para usuários
const router = express.Router()

//rota para cadastro de usuário
router.post('/register', async (req, res) => {
    const { email } = req.body

    try{
        //validando para caso já exista esse usuário
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists'  })

        const user = await User.create(req.body)

        //não retornar senha
        user.password = undefined;

        return res.send({ user })

    }catch (err){

        return res.status(400).send({ error: 'Registration Failed' })
    
    }
})

//fazendo a rota de autenticaçao
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    //o +password serve para mostrar a senha, por mais que esteja false no select na estrutura
    const user = await User.findOne({ email }).select('+password')

    if(!user)
        return res.status(400).send({ error: 'User not found' })

    //precisamos desencriptar a senha que está vindo do bd para comparar
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' })

    user.password = undefined
    
    res.send({ user })
})

//o /auth estará prefixada antes das outras rotas feitas no controller
module.exports = app => app.use('/auth', router)
