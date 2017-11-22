const express = require('express')
const dashboard = express.Router()
const db = require('../../../entities/db')
const authorizeRole = require('../../../middlewares/authorizeRole')

dashboard.get('/widgets',
  authorizeRole.project(),
  async (req, res, next) => {
    const widgets = await db('widget')
      .where('dashboardId', req.dashboard.id)

    res.json(widgets)

    return res.end()
  }
)

module.exports = dashboard
