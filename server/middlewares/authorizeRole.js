const db = require('../entities/db')

module.exports = roles => {
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

    if (!roles.includes(projectUser.role)) {
      return next(new Error('Unauthorized.'))
    }

    req.projectUser = projectUser

    return next()
  }
}
