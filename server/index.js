const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
})

if (!process.env.APP_SECRETKEY) {
  throw new Error('APP_SECRETKEY not defined.')
}

const app = require('./entities/app')
const http = require('http')
const port = process.env.APP_PORT || 3000

http
  .createServer(app)
  .listen(port, () => {
    console.info(`Server started on port ${port}`)
  })
