const express = require('express')
const router = express.Router()
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  router.use('/dist', express.static(path.resolve(__dirname, '../../dist')))
  router.use('/docs', express.static(path.resolve(__dirname, '../../docs')))
}

module.exports = router
