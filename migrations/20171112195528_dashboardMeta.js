exports.up = db => {
  return db.schema.createTable('dashboardMeta', t => {
    t.increments()
    t.integer('dashboardId').notNullable().unsigned().references('id').inTable('dashboard').index()
    t.string('name').notNullable()
    t.string('field').notNullable()
    t.text('value')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('dashboardMeta')
}
