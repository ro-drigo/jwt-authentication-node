const mongoose = require('../database')
const bcrypt = require('bcryptjs')


//criando a tabela do usuário
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//encriptando a senha
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    next()
})

//definindo a criação do model
const User = mongoose.model('User', UserSchema)

module.exports = User