const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const user = require('express').Router()
const db = require('../../entities/db')
const authorizeUser = require('../../middlewares/authorizeUser')

router.post('/login', async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new Error('Insufficient data.'))
  }

  const user = await db('user').where('email', req.body.email).first()

  if (!user) {
    return next(new Error('Incorrect credentials.'))
  }

  const encryptedPassword = crypto.createHash('sha512')
    .update(req.body.password + user.salt)
    .digest('hex')

  if (encryptedPassword !== user.password) {
    return next(new Error('Incorrect credentials.'))
  }

  const token = jwt.sign({
    identifier: user.identifier
  }, process.env.APP_SECRETKEY, {
    expiresIn: 60 * 60 * 24 * 30
  })

  res.json({
    token
  })

  return res.end()
})

router.post('/register', async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new Error('Insufficient data.'))
  }

  const user = await db('user').where('email', req.body.email).first()
  let identifier

  if (user) {
    const encryptedPassword = crypto.createHash('sha512')
      .update(req.body.password + user.salt)
      .digest('hex')

    if (encryptedPassword !== user.password) {
      return next(new Error('Incorrect credentials.'))
    }

    identifier = user.identifier
  } else {
    identifier = crypto.createHash('sha256')
      .update(req.body.email + Date.now().toString() + Math.random().toString().slice(2))
      .digest('hex')

    const salt = crypto.createHash('sha512')
      .update(Date.now().toString() + Math.random().toString().slice(2))
      .digest('hex')
    const password = crypto.createHash('sha512')
      .update(req.body.password + salt)
      .digest('hex')

    await db('user').insert({
      email: req.body.email,
      identifier,
      salt,
      password
    })
  }

  const token = jwt.sign({
    identifier
  }, process.env.APP_SECRETKEY, {
    expiresIn: 60 * 60 * 24 * 30
  })

  res.json({
    token
  })

  return res.end()
})

router.get('/', authorizeUser, (req, res) => {
  const token = jwt.sign({
    identifier: req.user.identifier
  }, process.env.APP_SECRETKEY, {
    expiresIn: 60 * 60 * 24 * 30
  })

  res.json({
    email: req.user.email,
    token
  })

  res.end()
})

user.use('/user', router)

module.exports = user
