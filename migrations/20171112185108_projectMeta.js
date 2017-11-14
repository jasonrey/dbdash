exports.up = db => {
  return db.schema.createTable('projectMeta', t => {
    t.increments()
    t.integer('projectId').notNullable().unsigned().references('id').inTable('project').index()
    t.string('field').notNullable()
    t.text('value')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('projectMeta')
}
