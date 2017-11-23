const path = require('path')
const glob = require('glob')
const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const project = express.Router()
const db = require('../../../entities/db')
const authorizeUser = require('../../../middlewares/authorizeUser')
const authorizeRole = require('../../../middlewares/authorizeRole')
const requiredFields = require('../../../middlewares/requiredFields')

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

router.get('/:projectId',
  authorizeRole.project(),
  async (req, res) => {
    res.json(req.project)
    res.end()
  }
)

router.put('/',
  requiredFields(['name']),
  async (req, res, next) => {
    const identifier = crypto.randomBytes(32).toString('hex')

    const [projectId] = await db('project').insert({
      name: req.body.name,
      identifier,
      userId: req.user.id
    })

    const project = await db('project').where('id', projectId).first()

    project.meta = {}

    await db('projectUser').insert({
      projectId,
      userId: req.user.id,
      role: 'owner',
      createdBy: req.user.id
    })

    project.role = 'owner'

    res.json(project)
    return res.end()
  }
)

router.post('/:projectId',
  authorizeRole.project(['owner', 'admin']),
  requiredFields(['name']),
  async (req, res, next) => {
    await db('project')
      .where('id', req.project.id)
      .update('name', req.body.name)

    res.json({
      state: true
    })
    return res.end()
  }
)

router.post('/:projectId/reset',
  authorizeRole.project(['owner', 'admin']),
  async (req, res, next) => {
    const identifier = crypto.randomBytes(32).toString('hex')

    await db('project')
      .where('id', req.project.id)
      .update('identifier', identifier)

    res.json({
      state: true,
      identifier
    })
  }
)

router.delete('/:projectId',
  authorizeRole.project(),
  requiredFields(['name']),
  async (req, res, next) => {
    if (req.projectUser.role === 'owner') {
      if (req.project.name !== req.body.name) {
        return next(new Error('Wrong project name.'))
      }

      await Promise.all([
        db('project').where('id', req.project.id).del(),
        db('projectUser').where('projectId', req.project.id).del(),
        db('projectMeta').where('projectId', req.project.id).del()
      ])
    } else {
      await db('projectUser')
        .where('projectId', req.project.id)
        .where('userId', req.user.id)
        .del()
    }

    res.json({
      state: true,
      isDelete: req.projectUser.role === 'owner'
    })
    return res.end()
  }
)

glob.sync(path.resolve(__dirname, './*'))
  .filter(file => path.basename(file) !== 'index.js')
  .map(file => router.use('/:projectId', require(file)))

project.use('/project', authorizeUser, router)

project.get('/projects',
  authorizeUser,
  async (req, res, next) => {
    const projects = await db('projectUser')
      .select('project.*', 'projectUser.role')
      .leftJoin('project', 'projectUser.projectId', 'project.id')
      .orderBy('project.createdAt', 'desc')

    res.json(projects)
    res.end()
  }
)

module.exports = project
