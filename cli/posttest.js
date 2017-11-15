const db = require('../server/entities/db')

;(async () => {
  await db.raw(`drop database ${process.env.DB_TESTDATABASE}`)

  db.destroy()
})()
