import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('snack', (table) => {
    table.uuid('id').primary()

    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()

    table.uuid('userId').index().references('id').inTable('user')
    table.boolean('status').defaultTo(false).notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('snack')
}
