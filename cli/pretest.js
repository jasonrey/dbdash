if (!process.env.DB_DATABASE) {
  throw new Error('No DB_DATABASE defined.')
}

const knex = require('knex')
const config = require('../knexfile')

delete config.connection.database

const db = knex(config)

;(async () => {
  await db.raw(`create database ${process.env.DB_DATABASE}`)

  db.destroy()
})()
