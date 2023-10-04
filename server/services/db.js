import objection from 'objection';
import knex from 'knex';
import config from 'config';

export default knex({
    ...config.knex,
    ...objection.knexSnakeCaseMappers(),
});
