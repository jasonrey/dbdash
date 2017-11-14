exports.up = db => {
  return db.schema.createTable('projectUser', t => {
    t.increments()
    t.integer('projectId').notNullable().unsigned().references('id').inTable('project').index()
    t.integer('userId').notNullable().unsigned().references('id').inTable('user').index()
    t.string('role')
    t.integer('createdBy').notNullable().unsigned().references('id').inTable('user')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('projectUser')
}
