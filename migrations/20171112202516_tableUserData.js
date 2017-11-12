exports.up = db => {
  return db.schema.createTable('tableUserData', t => {
    t.increments()
    t.integer('tableId').notNullable().unsigned().references('id').inTable('table')
    t.integer('userId').notNullable().unsigned().references('id').inTable('user')
    t.string('field').notNullable()
    t.integer('value')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())

    t.index(['tableId', 'userId'])
  })
}

exports.down = db => {
  return db.schema.dropTable('tableUserData')
}
