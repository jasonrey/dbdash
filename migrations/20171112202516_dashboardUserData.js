exports.up = db => {
  return db.schema.createTable('dashboardUserData', t => {
    t.increments()
    t.integer('dashboardId').notNullable().unsigned().references('id').inTable('dashboard').index()
    t.integer('userId').notNullable().unsigned().references('id').inTable('user')
    t.string('field').notNullable()
    t.integer('value')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())

    t.index(['dashboardId', 'userId'])
  })
}

exports.down = db => {
  return db.schema.dropTable('dashboardUserData')
}
