const router = require('express').Router()
const dashboard = require('express').Router()
const db = require('../../entities/db')
const authorizeUser = require('../../middlewares/authorizeUser')
const authorizeRole = require('../../middlewares/authorizeRole')
const requiredFields = require('../../middlewares/requiredFields')

router.use('/', authorizeUser)

dashboard.use('/dashboard', router)

module.exports = dashboard
