exports.up = db => {
  return db.schema.createTable('user', t => {
    t.increments()
    t.string('email').notNullable().index().unique()
    t.string('password', 128).notNullable()
    t.string('salt', 128).notNullable()
    t.string('identifier', 64).notNullable().index().unique()
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('user')
}
