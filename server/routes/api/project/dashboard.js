const express = require('express')
const dashboard = express.Router()
const db = require('../../../entities/db')
const authorizeRole = require('../../../middlewares/authorizeRole')

dashboard.get('/dashboards',
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

module.exports = dashboard
