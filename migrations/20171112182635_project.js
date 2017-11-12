exports.up = db => {
  return db.schema.createTable('project', t => {
    t.increments()
    t.string('name').notNullable()
    t.string('secret').notNullable()
    t.integer('userId').notNullable().unsigned().references('id').inTable('user')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('project')
}
