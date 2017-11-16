exports.up = db => {
  return db.schema.createTable('widgetMeta', t => {
    t.increments()
    t.integer('widgetId').notNullable().unsigned().references('id').inTable('widget').index()
    t.string('field').notNullable()
    t.text('value')
    t.timestamp('createdAt').defaultTo(db.fn.now())
    t.timestamp('updatedAt').defaultTo(db.fn.now())
  })
}

exports.down = db => {
  return db.schema.dropTable('widgetMeta')
}
