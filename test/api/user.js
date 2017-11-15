require('dotenv').config('../../.env')

const {test} = require('ava')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const app = require('../../server/entities/app')
const db = require('../../server/entities/db')

test.after(t => {
  return db.destroy()
})

test('POST /api/user/register|login - Success', async t => {
  const email = `${Math.random().toString().slice(2)}@${Math.random().toString().slice(2)}.com`
  const password = Math.random().toString().slice(2)

  const registerRes = await request(app)
    .post('/api/user/register')
    .send({
      email,
      password
    })

  t.is(registerRes.status, 200)
  t.is(typeof registerRes.body, 'object')
  t.is(typeof registerRes.body.token, 'string')

  const loginRes = await request(app)
    .post('/api/user/login')
    .send({
      email,
      password
    })

  t.is(loginRes.status, 200)
  t.is(typeof loginRes.body, 'object')
  t.is(typeof loginRes.body.token, 'string')

  const verifyRes = await request(app)
    .get('/api/user')
    .set('Authorization', `Bearer ${loginRes.body.token}`)

  t.is(verifyRes.status, 200)
  t.is(typeof verifyRes.body, 'object')
  t.is(verifyRes.body.email, email)
  t.is(typeof verifyRes.body.token, 'string')

  const user = await db('user').where('email', email).first()

  t.is(user.email, email)
  t.is(user.password, crypto.createHash('sha512').update(password + user.salt).digest('hex'))
})

test('POST /api/user/register - Missing data', async t => {
  const res = await request(app)
    .post('/api/user/register')

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Insufficient data.')
})

test('POST /api/user/register - Missing email', async t => {
  const email = `${Math.random().toString().slice(2)}@${Math.random().toString().slice(2)}.com`

  const res = await request(app)
    .post('/api/user/register')
    .send({
      email
    })

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Insufficient data.')
})

test('POST /api/user/register - Missing password', async t => {
  const password = Math.random().toString().slice(2)

  const res = await request(app)
    .post('/api/user/register')
    .send({
      password
    })

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Insufficient data.')
})

test.todo('POST /api/user/register - Email exist')

test('POST /api/user/login - Missing data', async t => {
  const res = await request(app)
    .post('/api/user/login')

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Insufficient data.')
})

test('POST /api/user/login - Missing email', async t => {
  const email = `${Math.random().toString().slice(2)}@${Math.random().toString().slice(2)}.com`

  const res = await request(app)
    .post('/api/user/login')
    .send({
      email
    })

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Insufficient data.')
})

test('POST /api/user/login - Missing password', async t => {
  const password = Math.random().toString().slice(2)

  const res = await request(app)
    .post('/api/user/login')
    .send({
      password
    })

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Insufficient data.')
})

test('POST /api/user/login - No email', async t => {
  const email = `${Math.random().toString().slice(2)}@${Math.random().toString().slice(2)}.com`
  const password = Math.random().toString().slice(2)

  const res = await request(app)
    .post('/api/user/login')
    .send({
      email,
      password
    })

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Incorrect credentials.')
})

test('POST /api/user/login - Wrong password', async t => {
  const email = `${Math.random().toString().slice(2)}@${Math.random().toString().slice(2)}.com`
  const password = Math.random().toString().slice(2)

  await request(app)
    .post('/api/user/register')
    .send({
      email,
      password
    })

  const res = await request(app)
    .post('/api/user/login')
    .send({
      email,
      password: Math.random().toString().slice(2)
    })

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Incorrect credentials.')
})

test('GET /api/user - Unauthorized', async t => {
  const res = await request(app)
    .get('/api/user')

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Unauthorized.')
})

test('GET /api/user - Invalid authorization', async t => {
  const res = await request(app)
    .get('/api/user')
    .set('Authorization', `Basic ${Math.random().toString().slice(2)}`)

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Unauthorized.')
})

test('GET /api/user - Token expired', async t => {
  const token = jwt.sign({
    identifier: Math.random().toString().slice(2)
  }, process.env.APP_SECRETKEY, {
    expiresIn: 1
  })

  t.log(token)

  await new Promise((resolve, reject) => {
    setTimeout(async () => {
      const res = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`)

      t.is(res.status, 400)
      t.is(typeof res.body, 'object')
      t.is(typeof res.body.message, 'string')
      t.is(res.body.message, 'Auth token expired.')

      resolve()
    }, 1500)
  })
})

test('GET /api/user - Invalid identifier', async t => {
  const token = jwt.sign({
    identifier: Math.random().toString().slice(2)
  }, process.env.APP_SECRETKEY, {
    expiresIn: process.env.APP_SESSIONLENGTH || 60 * 60 * 24 * 30
  })

  const res = await request(app)
    .get('/api/user')
    .set('Authorization', `Bearer ${token}`)

  t.is(res.status, 400)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body.message, 'string')
  t.is(res.body.message, 'Invalid auth token.')
})
