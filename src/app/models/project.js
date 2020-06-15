const mongoose = require('../../database')
const bcrypt = require('bcryptjs')


//criando a tabela do usuário
const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})


//definindo a criação do model
const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project