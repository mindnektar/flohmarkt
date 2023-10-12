export const up = async (knex) => {
    await knex.schema.createTable('market', (table) => {
        table.uuid('id').primary();
        table.string('name').notNullable();
        table.timestamp('start_date').notNullable();
        table.timestamp('end_date').notNullable();
        table.boolean('is_open_for_vendors').notNullable().defaultTo(false);
        table.timestamps(true, true);
    });
};

export const down = async (knex) => {
    await knex.schema.dropTable('market');
};
