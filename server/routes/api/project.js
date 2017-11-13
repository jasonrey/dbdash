const crypto = require('crypto')
const router = require('express').Router()
const project = require('express').Router()
const db = require('../../entities/db')
const authorizeUser = require('../../middlewares/authorizeUser')
const requiredFields = require('../../middlewares/requiredFields')

router.use('/', authorizeUser)

router.param('projectId', async (req, res, next, id) => {
  const [project, meta] = await Promise.all([
    db('project')
      .where('id', id)
      .first(),
    db('projectMeta')
      .where('projectId', id)
      .reduce((result, row) => {
        result[row.field] = row.value
        return result
      }, {})
  ])

  if (!project) {
    return next(new Error('No such project.'))
  }

  project.meta = meta

  req.project = project

  next()
})

router.get('/:projectId', async (req, res, next) => {
  res.json(req.project)
  res.end()
})

router.put('/',
  requiredFields(['name']),
  async (req, res, next) => {
    const identifier = crypto.randomBytes('32').toString('hex')

    const [projectId] = await db('project').insert({
      name: req.body.name,
      identifier,
      userId: req.user.id
    })

    const project = await db('project').where('id', projectId)

    project.meta = {}

    await db('projectUser').insert({
      projectId,
      userId: req.user.id,
      role: 'owner'
    })

    res.json(project)
    return res.end()
  })

router.get('/users',
  requiredFields(['identifier']),
  async (req, res, next) => {
    const users = await db('projectUser')
      .select('user.email', 'projectUser.role')
      .leftJoin('project', 'project.id', 'projectUser.projectId')
      .leftJoin('user', 'user.id', 'projectUser.userId')
      .where('project.identifier', req.body.identifier)

    res.json(users)
  })

project.use('/project', router)

project.get('/projects', async (req, res, next) => {
  const projects = await db('projectUser')
    .select('project.*', 'projectUser.role')
    .leftJoin('project', 'projectUser.projectId', 'project.id')
    .orderBy('project.created', 'desc')

  res.json(projects)
  res.end()
})

module.exports = project
