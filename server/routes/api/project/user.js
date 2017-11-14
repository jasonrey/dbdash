const express = require('express')
const router = express.Router()
const user = express.Router()
const db = require('../../../entities/db')
const authorizeRole = require('../../../middlewares/authorizeRole')
const requiredFields = require('../../../middlewares/requiredFields')

router.put('/',
  authorizeRole.project(['owner', 'admin']),
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

router.post('/:userId',
  requiredFields(['role']),
  authorizeRole.project(['owner', 'admin']),
  async (req, res, next) => {
    const projectUser = await db('projectUser')
      .where('userId', req.params.userId)
      .where('projectId', req.project.id)
      .first()

    if (!projectUser) {
      return next(new Error('No such user.'))
    }

    if (projectUser.role === 'owner') {
      return next(new Error('Cannot change owner\'s role.'))
    }

    if (projectUser.role === 'admin' && req.projectUser.role !== 'owner') {
      return next(new Error('Only owner can change admin\'s role.'))
    }

    if (req.body.role === 'owner') {
      return next(new Error('Cannot set user role as owner.'))
    }

    await db('projectUser')
      .where('userId', req.params.userId)
      .where('projectId', req.project.id)
      .update('role', req.body.role)

    res.json({
      state: true
    })
    return res.end()
  }
)

router.delete('/:userId',
  authorizeRole.project(['owner', 'admin']),
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

user.use('/user', router)

user.get('/users',
  authorizeRole.project(['owner', 'admin']),
  async (req, res, next) => {
    const users = await db('projectUser')
      .select('user.email', 'projectUser.role')
      .leftJoin('project', 'project.id', 'projectUser.projectId')
      .leftJoin('user', 'user.id', 'projectUser.userId')
      .where('project.id', req.project.id)

    res.json(users)
  })

module.exports = user
