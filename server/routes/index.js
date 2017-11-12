const glob = require('glob')
const path = require('path')
const router = require('express').Router()

glob.sync(path.resolve(__dirname, './*'))
  .filter(file => path.basename(file) !== 'index.js')
  .map(file => router.use('/', require(file)))

module.exports = router
