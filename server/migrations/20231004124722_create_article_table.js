export const up = async (knex) => {
    await knex.schema.createTable('article', (table) => {
        table.uuid('id').primary();
        table.uuid('vendor_id').notNullable().references('vendor.id').onDelete('cascade');
        table.uuid('sale_id').references('sale.id').onDelete('cascade');
        table.integer('key').notNullable();
        table.string('title').notNullable();
        table.string('info');
        table.boolean('is_new').notNullable().defaultTo(false);
        table.specificType('price', 'money').notNullable();
        table.timestamps(true, true);
    });
};

export const down = async (knex) => {
    await knex.schema.dropTable('article');
};
