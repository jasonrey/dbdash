exports.up = db => {
  return db.schema.createTable('dashboardPermission', t => {
    t.increments()
    t.integer('dashboardId').notNullable().unsigned().references('id').inTable('dashboard')
    t.integer('userId').notNullable().unsigned().references('id').inTable('user')
    t.string('role').notNullable()
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())

    t.index(['dashboardId', 'userId'])
  })
}

exports.down = db => {
  return db.schema.dropTable('dashboardPermission')
}
