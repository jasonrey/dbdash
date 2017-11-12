const jwt = require('jsonwebtoken')
const db = require('../entities/db')

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new Error('Unauthorized.'))
  }

  const [authType, authToken] = req.headers.authorization.split(' ')

  if (authType !== 'Bearer') {
    return next(new Error('Unauthorized.'))
  }

  let token

  try {
    token = jwt.verify(authToken, process.env.APP_SECRETKEY)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new Error('Auth token expired.'))
    }

    return next(new Error('Unauthorized.'))
  }

  const user = await db('user').where('identifier', token.identifier).first()

  if (!user) {
    return next(new Error('Invalid auth token.'))
  }

  req.user = user

  next()
}
