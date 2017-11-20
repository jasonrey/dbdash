const crypto = require('crypto')

exports.seed = async db => {
  await db('user').del()

  const salt = crypto.randomBytes(32).toString('hex')
  const identifier = crypto.randomBytes(32).toString('hex')
  const password = crypto.createHash('sha512')
    .update('password' + salt)
    .digest('hex')

  await db('user').insert({
    email: 'admin@localhost',
    password,
    salt,
    identifier
  })
}
