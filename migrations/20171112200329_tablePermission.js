exports.up = db => {
  return db.schema.createTable('tablePermission', t => {
    t.increments()
    t.integer('tableId').notNullable().unsigned().references('id').inTable('table')
    t.string('role').notNullable()
    t.string('field').notNullable()
    t.integer('value')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())

    t.index(['tableId', 'role'])
  })
}

exports.down = db => {
  return db.schema.dropTable('tablePermission')
}
