exports.up = db => {
  return db.schema.createTable('tableColumn', t => {
    t.increments()
    t.integer('tableId').notNullable().unsigned().references('id').inTable('table')
    t.string('name').notNullable()
    t.string('field').notNullable()
    t.text('value')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())

    t.index(['tableId', 'name'])
  })
}

exports.down = db => {
  return db.schema.dropTable('tableColumn')
}
