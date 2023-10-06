import config from 'config';

const knexconf = () => ({
    client: config.knex.client,
    connection: config.knex.connection,
    migrations: config.knex.migrations,
    debug: config.knex.debug,
});

export default {
    development: knexconf(),
    production: knexconf(),
};
