const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')


module.exports = (req, res, next) => {
    //vamos ver se o header (onde vai vir o token) está de acordo para prosseguir
    const authHeader = req.headers.authorization

    if(!authHeader)
        return res.status(401).send({ error: 'No token provided' })

    //verificando se o token está no formato certo (Bearer ijijwqiejsaeqow23iorj3)
    const parts = authHeader.split(' ')
    
    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token error' })

    //desestruturando o array em 2
    const [ scheme, token ] = parts

    //verificando se tem o Bearer no primeiro array
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted' })

    //o decoded é o id do usuário se o token estiver certo
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Token invalid' })

        //passando o id para o nosso controller
        req.userId = decoded.id
        //o next deixa passar para o próximo
        return next()
    })
}