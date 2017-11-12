require('dotenv').config()

module.exports = {
  client: process.env.DB_CLIENT || 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'dbdash-admin'
  },
  migrations: {
    tableName: process.env.DB_MIGRATIONTABLE || '.migrations'
  }
}
