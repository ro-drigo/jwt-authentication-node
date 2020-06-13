const express = require('express')
//buscando nossa tabela usuário
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

//importar o hash (secret)
const authConfig = require('../../config/auth.json')

//Router para definir rotas só para usuários
const router = express.Router()

//gerar token
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        //token vai expirar em 1 dia
        expiresIn: 86400
    })
}

//rota para cadastro de usuário
router.post('/register', async (req, res) => {
    const { email } = req.body

    try{
        //validando para caso já exista esse usuário
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists'  })

        const user = await User.create(req.body)

        //não retornar senha
        user.password = undefined

        //retornando, além do usuário, o token para acesso
        return res.send({ 
            user,
            token: generateToken({ id: user.id })
        })

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

    //esconder a password
    user.password = undefined
    
    res.send({ 
        user, 
        token: generateToken({ id: user.id }) 
    })
})

//rota para esquecer senha
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        
        const user = await User.findOne({ email })

        if(!user)
            return res.status(400).send({ error: 'User not found' })

        //token para expirar
        const token = crypto.randomBytes(20).toString('hex')
        
        //fazendo para expirar depois de uma hora
        const now = new Date()
        now.setHours(now.getHours() + 1)

        //colocando a data de expiração junto ao usuário
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        })

        await mailer.sendMail({
            to: email,
            from: 'rodrigo.santos7202@gmail.com',
            subject: 'Test',
            template: 'forgot_password',
            context: { token }
        }, (err) => {
            if(err)
                return res.status(400).send({ error: 'Cannot send forgot password email' })
        
            return res.send()
        })

    } catch(err){
        res.status(400).status({ error: 'Error on forgot password, try again' })
    }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body

    try{
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')
    
        if(!user)
            return res.status(400).send({ error: 'User not found' })
        
        if(token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' })
        
        const now = new Date()

        if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one' })

        user.password = password

        await user.save()

        res.send()
    
        }catch(err){
        res.status(400).send({ error: 'Cannot reset password, try again' })
    }
})

//o /auth estará prefixada antes das outras rotas feitas no controller
module.exports = app => app.use('/auth', router)
