const express = require('express')
const authMiddleware = require('../middlewares/auth')

const Project = require('../models/project')
const Task = require('../models/task')

const router = express.Router()

//ver se o token está válido
router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        //com o populate podemos usar o iggerloading
        const projects = await Project.find().populate('user')

        return res.send({ projects })

    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects' })
    }
})

//listar um só
router.get('/:projectId', async (req, res) => {
    try {
        //com o populate podemos usar o iggerloading
        const project = await Project.findById(req.params.projectId).populate('user')

        return res.send({ project })

    } catch (err) {
        return res.status(400).send({ error: 'Error loading project' })
    }
})

//rota para criar
router.post('/', async (req, res) => {
    try {
        const project = await Project.create({ ...req.body, user: req.userId })

        return res.send({ project })

    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project' })
    }
})

//rota para editar
router.put('/:projectId', async (req, res) => {
    res.send({ user: req.userId })
})

//rota para deletar
router.delete('/:projectId', async (req, res) => {
    try {
        //com o populate podemos usar o iggerloading
        await Project.findByIdAndRemove(req.params.projectId).populate('user')

        return res.send()

    } catch (err) {
        return res.status(400).send({ error: 'Error deleting project' })
    }
})

module.exports = app => app.use('/projects', router)