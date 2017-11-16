const path = require('path')
const glob = require('glob')
const express = require('express')
const router = express.Router()
const widget = express.Router()
const db = require('../../../entities/db')
const authorizeUser = require('../../../middlewares/authorizeUser')
const authorizeRole = require('../../../middlewares/authorizeRole')
const requiredFields = require('../../../middlewares/requiredFields')

router.use('/', authorizeUser)

router.param('widgetId', async (req, res, next, id) => {
  const [widget, meta] = await Promise.all([
    db('widget')
      .where('id', id)
      .first(),
    db('widgetMeta')
      .where('widgetId', id)
      .reduce((result, row) => {
        result[row.field] = row.value
        return result
      }, {})
  ])

  if (!widget) {
    return next(new Error('No such widget.'))
  }

  widget.meta = meta

  req.widget = widget

  const dashboard = await db('dashboard')
    .where('id', widget.dashboardId)
    .first()

  req.dashboard = dashboard

  next()
})

router.put('/',
  authorizeRole.dashboard(['owner', 'admin']),
  requiredFields(['name', 'position', 'type']),
  async (req, res, next) => {
    await db('widget')
      .insert({
        dashboardId: req.dashboard.id,
        createdBy: req.user.id,
        name: req.body.name,
        position: req.body.position,
        type: req.body.type
      })

    res.json({
      state: true
    })
    return res.end()
  }
)
router.get('/:widgetId',
  authorizeRole.dashboard(),
  async (req, res) => {
    res.json(req.widget)
    res.end()
  }
)

router.post('/:widgetId',
  authorizeRole.dashboard(['admin', 'owner']),
  async (req, res) => {
    const data = {}

    if (req.body.name) {
      data.name = req.body.name
    }

    if (req.body.position) {
      data.position = req.body.position
    }

    await db('widget')
      .where('widgetId', req.widget.id)
      .update(data)

    await Promise.all(
      Object.keys(req.body)
        .filter(key => key !== 'name' && key !== 'position')
        .map(async key => {
          const meta = await db('widgetMeta')
            .where('widgetId', req.widget.id)
            .where('field', key)
            .first()

          if (meta) {
            await db('widgetMeta')
              .where('widgetId', req.widget.id)
              .where('field', key)
              .update({
                value: req.body[key]
              })
          } else {
            await db('widgetMeta')
              .insert({
                widgetId: req.widget.id,
                field: key,
                value: req.body[key]
              })
          }
        })
    )

    res.json({
      state: true
    })

    return res.end()
  }
)

router.delete('/:widgetId',
  authorizeRole.dashboard(['admin', 'owner']),
  async (req, res, next) => {
    await Promise.all([
      db('widget').where('id', req.widget.id).del(),
      db('widgetMeta').where('widgetId', req.widget.id).del()
    ])

    res.json({
      state: true
    })
    return res.end()
  }
)

glob.sync(path.resolve(__dirname, './*'))
  .filter(file => path.basename(file) !== 'index.js')
  .map(file => router.use('/:widgetId', require(file)))

widget.use('/widget', router)

module.exports = widget
