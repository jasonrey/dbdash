exports.up = db => {
  return db.schema.createTable('dashboardUser', t => {
    t.increments()
    t.integer('dashboardId').notNullable().unsigned().references('id').inTable('dashboard').index()
    t.integer('userId').notNullable().unsigned().references('id').inTable('user').index()
    t.string('role')
    t.integer('createdBy').notNullable().unsigned().references('id').inTable('user')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('dashboardUser')
}
