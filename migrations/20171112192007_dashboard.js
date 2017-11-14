exports.up = db => {
  return db.schema.createTable('dashboard', t => {
    t.increments()
    t.integer('projectId').notNullable().unsigned().references('id').inTable('project').index()
    t.string('name').notNullable()
    t.integer('ordering')
    t.integer('createdBy').notNullable().unsigned().references('id').inTable('user')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('dashboard')
}
