const faker = require('faker')
const crypto = require('crypto')

exports.seed = async db => {
  await db('project').del()

  const user = await db('user').where('email', 'admin@localhost').first()

  const [projectId] = await db('project')
    .insert({
      name: faker.random.words(2),
      identifier: crypto.randomBytes(32).toString('hex'),
      userId: user.id
    })

  await db('projectUser')
    .insert({
      userId: user.id,
      createdBy: user.id,
      role: 'owner',
      projectId
    })
}
