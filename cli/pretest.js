const knex = require('knex')
const config = require('../knexfile')

delete config.connection.database

const db = knex(config)

;(async () => {
  try {
    await db.raw(`drop database ${process.env.DB_TESTDATABASE}`)
  } catch (err) {}

  try {
    await db.raw(`create database ${process.env.DB_TESTDATABASE}`)
  } catch (err) {}

  db.destroy()
})()
