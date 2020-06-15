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
        const projects = await Project.find().populate(['user', 'tasks'])

        return res.send({ projects })

    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects' })
    }
})

//listar um só
router.get('/:projectId', async (req, res) => {
    try {
        //com o populate podemos usar o iggerloading
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks'])

        return res.send({ project })

    } catch (err) {
        return res.status(400).send({ error: 'Error loading project' })
    }
})

//rota para criar
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body

        const project = await Project.create({ title, description, user: req.userId })

        //percorrer as tasks
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()

            project.tasks.push(projectTask)
        }))

        await project.save()

        return res.send({ project })

    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project' })
    }
})

//rota para editar
router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body

        const project = await Project.findByIdAndUpdate(req.params.projectId, { 
            title, 
            description 
            //com o new true, o mongo mostra o atualizado
            }, { new: true })
        
        project.tasks = []
        await Task.remove({ project: project._id })

        //percorrer as tasks
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()

            project.tasks.push(projectTask)
        }))

        await project.save()

        return res.send({ project })

    } catch (err) {
        return res.status(400).send({ error: 'Error on updating project' })
    }
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