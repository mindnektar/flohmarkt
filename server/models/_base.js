import debugFactory from 'debug';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { Model } from 'objection';
import db from 'services/db';
import CustomQueryBuilder from './_base/queryBuilder';
import convertGraphqlInfoToRelationExpressionAndFilters from './_base/convertGraphqlInfoToRelationExpressionAndFilters';

const debug = debugFactory('care:api:models:base');

Model.knex(db);

export default class BaseModel extends Model {
    static get modelPaths() {
        return [__dirname];
    }

    static get tableName() {
        return `${this.name.substring(0, 1).toLowerCase()}${this.name.substring(1)}`;
    }

    static get QueryBuilder() {
        return CustomQueryBuilder;
    }

    static generateId() {
        return uuid();
    }

    async $beforeInsert(context) {
        await super.$beforeInsert(context);

        if (this.constructor.idColumn.includes('id')) {
            this.id = this.id || this.constructor.generateId(this);
        }
    }

    async $beforeUpdate(context) {
        await super.$beforeUpdate(context);

        if (this.constructor.hasTimestamps) {
            this.updatedAt = moment().toISOString();
        }
    }

    $fetchGraphqlGraph(...args) {
        const trx = typeof args[0] === 'function' ? args.shift() : undefined;
        const [info, additionalExpression, auth, skipFetched = false] = args;

        debug('$fetchGraphqlGraph with info %j, additionalExpression %j, auth %j', info, additionalExpression, auth);
        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            info,
            this.constructor,
            additionalExpression,
            auth,
        );

        return this
            .$fetchGraph(relationExpression, { transaction: trx, skipFetched })
            .modifiers(filters);
    }

    static fetchGraphqlGraph(...args) {
        const trx = typeof args[0] === 'function' ? args.shift() : undefined;
        const [models, info, additionalExpression, auth] = args;

        debug('fetchGraphqlGraph with info %j, additionalExpression %j, auth %j', info, additionalExpression, auth);
        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            info,
            this,
            additionalExpression,
            auth,
        );

        return this
            .fetchGraph(models, relationExpression, { transaction: trx })
            .modifiers(filters);
    }
}
