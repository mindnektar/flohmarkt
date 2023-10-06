export const up = async (knex) => {
    await knex.schema.createTable('vendor', (table) => {
        table.uuid('id').primary();
        table.uuid('user_id').references('user.id').onDelete('cascade');
        table.uuid('market_id').references('market.id').onDelete('cascade');
        table.integer('key').notNullable();
        table.boolean('is_approved');
        table.timestamps(true, true);
    });
};

export const down = async (knex) => {
    await knex.schema.dropTable('vendor');
};
