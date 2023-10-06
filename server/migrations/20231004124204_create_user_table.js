export const up = async (knex) => {
    await knex.schema.createTable('user', (table) => {
        table.uuid('id').primary();
        table.string('role').notNullable();
        table.string('email').notNullable();
        table.string('password_hash');
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.timestamps(true, true);
    });
};

export const down = async (knex) => {
    await knex.schema.dropTable('user');
};
