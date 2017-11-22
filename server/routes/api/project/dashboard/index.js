const path = require('path')
const glob = require('glob')
const express = require('express')
const router = express.Router()
const dashboard = express.Router()
const db = require('../../../../entities/db')
const authorizeRole = require('../../../../middlewares/authorizeRole')
const requiredFields = require('../../../../middlewares/requiredFields')

router.param('dashboardId', async (req, res, next, id) => {
  const [dashboard, meta] = await Promise.all([
    db('dashboard')
      .where('id', id)
      .first(),
    db('dashboardMeta')
      .where('dashboardId', id)
      .reduce((result, row) => {
        result[row.field] = row.value
        return result
      }, {})
  ])

  if (!dashboard) {
    return next(new Error('No such dashboard.'))
  }

  dashboard.meta = meta

  req.dashboard = dashboard

  next()
})

router.put('/',
  authorizeRole.project(['owner', 'admin']),
  requiredFields(['name']),
  async (req, res, next) => {
    let {nextOrdering} = await db('dashboard')
      .max('ordering as nextOrdering')
      .where('projectId', req.project.id)
      .first()

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

router.get('/:dashboardId',
  authorizeRole.dashboard(),
  (req, res) => {
    res.json(req.dashboard)
    return res.end()
  }
)

router.post('/:dashboardId',
  authorizeRole.dashboard(['admin', 'owner']),
  requiredFields(['name']),
  async (req, res) => {
    await db('dashboard')
      .where('dashboardId', req.dashboard.id)
      .update('name', req.body.name)

    res.json({
      state: true
    })

    return res.end()
  }
)

router.delete('/:dashboardId',
  authorizeRole.dashboard(['admin', 'owner']),
  async (req, res, next) => {
    await Promise.all([
      db('dashboard').where('id', req.dashboard.id).del(),
      db('dashboardMeta').where('dashboardId', req.dashboard.id).del(),
      db('dashboardUser').where('dashboardId', req.dashboard.id).del(),
      db('dashboardUserData').where('dashboardId', req.dashboard.id).del()
    ])

    res.json({
      state: true
    })
    return res.end()
  }
)

glob.sync(path.resolve(__dirname, './*'))
  .filter(file => path.basename(file) !== 'index.js')
  .map(file => router.use('/:dashboardId', require(file)))

dashboard.use('/dashboard', router)

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
