const express = require('express')
const router = express.Router()
const db = require('../../../entities/db')
const authorizeRole = require('../../../middlewares/authorizeRole')
const requiredFields = require('../../../middlewares/requiredFields')

router.put('/dashboard',
  authorizeRole.project(['owner', 'admin']),
  requiredFields(['name']),
  async (req, res, next) => {
    let nextOrdering = await db('dashboard')
      .max('ordering')
      .where('projectId', req.project.id)

    if (!nextOrdering) {
      nextOrdering = 0
    }

    nextOrdering++

    const [dashboardId] = await db('dashboard')
      .insert({
        name: req.body.name,
        createdBy: req.user.id,
        ordering: nextOrdering,
        projectId: req.project.id
      })

    const [dashboard, projectUsers] = await Promise.all([
      db('dashboard').where('id', dashboardId).first(),
      db('projectUser')
        .where('projectId', req.project.id)
        .map(row => {
          return {
            userId: row.userId,
            role: row.userId === req.user.id ? 'owner' : row.role,
            dashboardId,
            createdBy: req.user.id
          }
        })
    ])

    await db('dashboardUser').insert(projectUsers)

    res.json(dashboard)

    return res.end()
  }
)

router.get('/dashboards',
  authorizeRole.project(),
  async (req, res, next) => {
    const dashboards = await db('dashboard')
      .rightJoin('dashboardUser', 'dashboard.id', 'dashboardUser.dashboardId')
      .where('dashboard.projectId', req.project.id)
      .where('dashboardUser.userId', req.user.id)
      .orderBy('dashboard.ordering')

    res.json(dashboards)

    return res.end()
  }
)

module.exports = router
