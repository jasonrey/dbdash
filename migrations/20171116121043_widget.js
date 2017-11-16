exports.up = db => {
  return db.schema.createTable('widget', t => {
    t.increments()
    t.integer('dashboardId').notNullable().unsigned().references('id').inTable('dashboard').index()
    t.string('name').notNullable()
    t.string('type').notNullable()
    t.string('position')
    t.integer('createdBy').notNullable().unsigned().references('id').inTable('user')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('widget')
}
