const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

app.disable('x-powered-by')
app.use(require('compression')())
app.set('trust proxy', true)
app.set('env', process.env.NODE_ENV)

app.use(cookieParser())

app.use('/', require('./routes'))

module.exports = app
