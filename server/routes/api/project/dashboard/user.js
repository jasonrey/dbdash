const express = require('express')
const router = express.Router()
const user = express.Router()
const db = require('../../../../entities/db')
const authorizeRole = require('../../../../middlewares/authorizeRole')
const requiredFields = require('../../../../middlewares/requiredFields')

router.put('/',
  authorizeRole.dashboard(['owner', 'admin']),
  requiredFields(['email', 'role']),
  async (req, res, next) => {
    if (req.body.role === 'owner') {
      return next(new Error('Cannot create another owner.'))
    }

    let user = await db('user').where('email', req.body.email).first()

    const newUser = !user

    if (newUser) {
      const [newUserId] = await db('user').insert({
        email: req.body.email
      })

      user = await db('user').where('id', newUserId).first()
    }

    await db('dashboardUser')
      .insert({
        dashboardId: req.dashboard.id,
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
  authorizeRole.dashboard(['owner', 'admin']),
  async (req, res, next) => {
    const dashboardUser = await db('dashboardUser')
      .where('userId', req.params.userId)
      .where('dashboardId', req.dashboard.id)
      .first()

    if (!dashboardUser) {
      return next(new Error('No such user.'))
    }

    if (dashboardUser.role === 'owner') {
      return next(new Error('Cannot change owner\'s role.'))
    }

    if (dashboardUser.role === 'admin' && req.dashboardUser.role !== 'owner') {
      return next(new Error('Only owner can change admin\'s role.'))
    }

    if (req.body.role === 'owner') {
      return next(new Error('Cannot set user role as owner.'))
    }

    await db('dashboardUser')
      .where('userId', req.params.userId)
      .where('dashboardId', req.dashboard.id)
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
    const dashboardUser = await db('dashboardUser')
      .where('userId', req.params.userId)
      .where('dashboardId', req.dashboard.id)
      .first()

    if (dashboardUser.role === 'owner') {
      return next(new Error('Cannot delete dashboard owner.'))
    }

    if (dashboardUser.role === 'admin' && req.dashboardUser.role !== 'onwer') {
      return next(new Error('Only dashboard owner can delete admins.'))
    }

    await Promise.all([
      db('dashboardUser')
        .where('userId', req.params.userId)
        .where('dashboardId', req.dashboard.id)
        .del(),
      db('dashboardUserData')
        .where('userId', req.params.userId)
        .where('dashboardId', req.dashboard.id)
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
  authorizeRole.dashboard(['owner', 'admin']),
  async (req, res, next) => {
    const users = await db('dashboardUser')
      .select('user.email', 'dashboardUser.role')
      .leftJoin('dashboard', 'dashboard.id', 'dashboardUser.dashboardId')
      .leftJoin('user', 'user.id', 'dashboardUser.userId')
      .where('dashboard.id', req.dashboard.id)

    res.json(users)
  }
)

module.exports = user
