const mongoose = require('../../database')
const bcrypt = require('bcryptjs')


//criando a tabela do usuário
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


//definindo a criação do model
const Task = mongoose.model('Task', TaskSchema)

module.exports = Task