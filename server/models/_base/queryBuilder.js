import { QueryBuilder } from 'objection';
import convertGraphqlInfoToRelationExpressionAndFilters from './convertGraphqlInfoToRelationExpressionAndFilters';

const isObjectWithoutId = (value, relation) => (
    value
    && typeof value === 'object'
    && !Array.isArray(value)
    && !value.id
    && !!relation
);

const convertNodesWithoutIdToRelationExpression = (graph, modelClass) => (
    Object.entries(graph).reduce((result, [key, value]) => {
        const relation = require(`../${modelClass}`).default.relationMappings?.[key];

        if (isObjectWithoutId(value, relation)) {
            const subs = convertNodesWithoutIdToRelationExpression(value, relation.modelClass);

            return [
                ...result,
                subs.length > 0 ? `${key}.[${subs}]` : key,
            ];
        }

        return result;
    }, [])
);

const populateGraphWithIds = (graph, instance, modelClass) => (
    Object.entries(graph).reduce((result, [key, value]) => {
        const relation = require(`../${modelClass}`).default.relationMappings?.[key];

        if (
            isObjectWithoutId(value, relation)
            && instance[key]
            && relation.relation.name === 'BelongsToOneRelation'
        ) {
            return {
                ...result,
                [key]: {
                    id: instance[key].id,
                    ...populateGraphWithIds(value, instance[key], relation.modelClass),
                },
            };
        }

        return { ...result, [key]: value };
    }, {})
);

export default class CustomQueryBuilder extends QueryBuilder {
    // `upsertGraph` is unable to update BelongsToOneRelations if no id is passed but a
    // representation in the database exists. This helper traverses the passed graph and adds id
    // keys to all nodes *without* ids but *with* a row in the database. If there is no row, no id
    // will be added and an insert will be performed as usual.
    // see https://github.com/Vincit/objection.js/issues/1112
    async transformGraphForBelongsToOneRelations(graph) {
        const modelClass = this.modelClass().name;
        const relations = convertNodesWithoutIdToRelationExpression(graph, modelClass);

        if (relations.length > 0) {
            const instance = await this.modelClass().query(this.context().transaction).findById(graph.id);

            await instance.$fetchGraph(`[${relations}]`);

            return populateGraphWithIds(graph, instance, modelClass);
        }

        return graph;
    }

    // @overrides super.upsertGraph
    async upsertGraph(graph, options) {
        return super.upsertGraph(
            await this.transformGraphForBelongsToOneRelations(graph),
            options,
        );
    }

    // @overrides super.upsertGraphAndFetch
    async upsertGraphAndFetch(graph, options) {
        return super.upsertGraphAndFetch(
            await this.transformGraphForBelongsToOneRelations(graph),
            options,
        );
    }

    filter(filter = {}, extra = {}) {
        const { filters } = this.modelClass();

        Object.entries(filter).forEach(([key, value]) => {
            if (filters[key]) {
                filters[key](this, value, extra);
            }
        });

        return this;
    }

    withGraphqlGraphFetched(info, additionalExpression, auth) {
        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            info,
            this.modelClass(),
            additionalExpression,
            auth,
        );

        return this
            .withGraphFetched(relationExpression)
            .modifiers(filters);
    }

    modifyOrderBy(columnName) {
        return this.context().clear?.includes('orderBy') ? this : this.orderBy(columnName);
    }
}
