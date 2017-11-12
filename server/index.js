require('dotenv').config({
  path: '../.env'
})

if (!process.env.APP_SECRET) {
  throw new Error('APP_SECRET not defined.')
}

const app = require('./entities/app')
const http = require('http')
const port = process.env.APP_PORT || 3000

http
  .createServer(app)
  .listen(port, () => {
    console.info(`Server started on port ${port}`)
  })
