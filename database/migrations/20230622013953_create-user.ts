import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user', (table) => {
    table.uuid('id').primary()

    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()

    table.uuid('sessionId').nullable().index()
    table.string('username').unique().notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user')
}
