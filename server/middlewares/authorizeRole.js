const db = require('../entities/db')

exports.project = roles => {
  return async (req, res, next) => {
    if (!req.user || !req.project) {
      return next(new Error('Unauthorized.'))
    }

    const projectUser = await db('projectUser')
      .where('userId', req.user.id)
      .where('projectId', req.project.id)
      .first()

    if (!projectUser) {
      return next(new Error('Unauthorized.'))
    }

    if (roles.length && !roles.includes(projectUser.role)) {
      return next(new Error('Unauthorized.'))
    }

    req.projectUser = projectUser

    return next()
  }
}

exports.dashboard = roles => {
  return async (req, res, next) => {
    if (!req.user || !req.dashboard) {
      return next(new Error('Unauthorized.'))
    }

    const dashboardUser = await db('dashboardUser')
      .where('userId', req.user.id)
      .where('dashboardId', req.dashboard.id)
      .first()

    if (!dashboardUser) {
      return next(new Error('Unauthorized.'))
    }

    if (roles.length && !roles.includes(dashboardUser.role)) {
      return next(new Error('Unauthorized.'))
    }

    req.dashboardUser = dashboardUser

    return next()
  }
}
