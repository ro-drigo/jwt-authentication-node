const express = require('express')
const authMiddleware = require('../middlewares/auth')

const Project = require('../models/project')
const Task = require('../models/task')

const router = express.Router()

//ver se o token está válido
router.use(authMiddleware)

router.get('/', async (req, res) => {
    res.send({ user: req.userId })
})

//listar um só
router.get('/:projectId', async (req, res) => {
    res.send({ user: req.userId })
})

//rota para criar
router.post('/', async (req, res) => {
    try {
        const project = await Project.create(req.body)

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
    res.send({ user: req.userId })
})

module.exports = app => app.use('/projects', router)