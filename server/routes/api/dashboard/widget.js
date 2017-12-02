const express = require('express')
const dashboard = express.Router()
const db = require('../../../entities/db')
const authorizeRole = require('../../../middlewares/authorizeRole')

dashboard.get('/widgets',
  authorizeRole.dashboard(),
  async (req, res, next) => {
    const widgets = await db('widget')
      .select('widget.*', 'widgetMeta.field', 'widgetMeta.value')
      .leftJoin('widgetMeta', 'widget.id', 'widgetMeta.widgetId')
      .where('dashboardId', req.dashboard.id)
      .reduce((result, widget) => {
        if (!result[widget.id]) {
          widget.meta = {}
          widget.meta[widget.field] = widget.value

          delete widget.field
          delete widget.value

          result[widget.id] = widget
        } else {
          result[widget.id].meta[widget.field] = widget.value
        }

        return result
      }, {})

    res.json(Object.values(widgets))

    return res.end()
  }
)

module.exports = dashboard
