export const up = async (knex) => {
    await knex.schema.createTable('sale', (table) => {
        table.uuid('id').primary();
        table.uuid('vendor_id').references('vendor.id').onDelete('cascade');
        table.timestamps(true, true);
    });
};

export const down = async (knex) => {
    await knex.schema.dropTable('sale');
};
