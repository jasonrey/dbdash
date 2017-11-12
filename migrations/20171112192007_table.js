exports.up = db => {
  return db.schema.createTable('table', t => {
    t.increments()
    t.integer('projectId').notNullable().unsigned().references('id').inTable('project')
    t.string('name').notNullable()
    t.string('field').notNullable()
    t.text('value')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())

    t.index(['projectId', 'name'])
  })
}

exports.down = db => {
  return db.schema.dropTable('table')
}
