const crypto = require('crypto')
const router = require('express').Router()
const project = require('express').Router()
const db = require('../../entities/db')
const authorizeUser = require('../../middlewares/authorizeUser')
const authorizeRole = require('../../middlewares/authorizeRole')
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
    const identifier = crypto.randomBytes(32).toString('hex')

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

router.post('/:projectId',
  authorizeRole(['owner', 'admin']),
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

router.delete('/:projectId',
  authorizeRole(['owner']),
  requiredFields(['name']),
  async (req, res, next) => {
    if (req.project.name !== req.body.name) {
      return next(new Error('Wrong project name.'))
    }

    await Promise.all([
      db('project').where('id', req.project.id).del(),
      db('projectUser').where('projectId', req.project.id).del(),
      db('projectMeta').where('projectId', req.project.id).del()
    ])

    res.json({
      state: true
    })
    return res.end()
  }
)

router.delete('/:projectId/remove', async (req, res, next) => {
  await db('projectUser')
    .where('projectId', req.project.id)
    .where('userId', req.user.id)
    .del()

  res.json({
    state: true
  })
  res.end()
})

router.get('/:projectId/users',
  authorizeRole(['owner', 'admin']),
  async (req, res, next) => {
    const users = await db('projectUser')
      .select('user.email', 'projectUser.role')
      .leftJoin('project', 'project.id', 'projectUser.projectId')
      .leftJoin('user', 'user.id', 'projectUser.userId')
      .where('project.id', req.project.id)

    res.json(users)
  })

router.put('/:projectId/user',
  authorizeRole(['owner', 'admin']),
  requiredFields(['email', 'role']),
  async (req, res, next) => {
    let user = await db('user').where('email', req.body.email).first()

    const newUser = !user

    if (newUser) {
      const [newUserId] = await db('user').insert({
        email: req.body.email
      })

      user = await db('user').where('id', newUserId).first()
    }

    await db('projectUser')
      .insert({
        projectId: req.project.id,
        userId: user.id,
        role: req.body.role,
        createdBy: req.user.id
      })

    res.json({
      state: true,
      newUser
    })
  }
)

router.delete('/:projectId/user/:userId',
  authorizeRole(['owner', 'admin']),
  async (req, res, next) => {
    const projectUser = await db('projectUser')
      .where('userId', req.params.userId)
      .where('projectId', req.project.id)
      .first()

    if (projectUser.role === 'owner') {
      return next(new Error('Cannot delete project owner.'))
    }

    if (projectUser.role === 'admin' && req.projectUser.role !== 'onwer') {
      return next(new Error('Only project owner can delete admins.'))
    }

    await Promise.all([
      db('projectUser')
        .where('userId', req.params.userId)
        .where('projectId', req.project.id)
        .del()
    ])

    res.json({
      state: true
    })

    return res.end()
  }
)

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
