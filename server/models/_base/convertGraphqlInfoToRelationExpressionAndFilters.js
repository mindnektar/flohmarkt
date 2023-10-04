import debugFactory from 'debug';
import { ImplementationError } from 'errors';

const debug = debugFactory('care:api:models:convertGraphqlInfoToRelationExpressionAndFilters');

const modifyRelationExpression = (object, level) => (
    Object.entries(object).forEach(([key, value]) => {
        // eslint-disable-next-line no-param-reassign
        level[key] = level[key] || value;

        if (typeof value === 'object') {
            modifyRelationExpression(value, level[key]);
        }
    })
);

export default (info, modelClass, additionalExpression, auth) => {
    debug('starting with model class: %s', modelClass.name);

    if (!info) {
        debug('no info, no relation expression');

        return {
            relationExpression: additionalExpression,
            filters: null,
        };
    }

    const filters = {};
    const findSubSelections = (fields, previousModelClass) => (
        fields.reduce((result, current) => {
            if (current.kind === 'FragmentSpread') {
                return {
                    ...result,
                    ...findSubSelections(
                        info.fragments[current.name.value].selectionSet.selections,
                        previousModelClass,
                    ),
                };
            }

            if (current.kind === 'InlineFragment') {
                if (previousModelClass.name === current.typeCondition.name.value) {
                    const nextModelClass = require(`../${current.typeCondition.name.value}`).default;

                    return {
                        ...result,
                        ...findSubSelections(
                            current.selectionSet.selections,
                            nextModelClass,
                        ),
                    };
                }

                return result;
            }

            if (current.selectionSet) {
                const relationName = current.name.value;
                const relation = previousModelClass.relationMappings[relationName];

                if (!relation) {
                    debug('relation "%s" does not exist in model %s', relationName, previousModelClass.name);

                    return result;
                }

                if (previousModelClass.skipEagerLoading?.includes(relationName)) {
                    debug('relation "%s" in model %s should not be loaded eagerly', relationName, previousModelClass.name);

                    return result;
                }

                const nextModelClass = require(`../${relation.modelClass}`).default;

                const mandatorySubSelections = nextModelClass.alwaysIncludeInGraph?.reduce((mandatoryFields, fieldName) => ({
                    ...mandatoryFields,
                    [fieldName]: {},
                }), {}) || {};

                debug('descending into relation %j', relation);
                const subSelections = {
                    ...mandatorySubSelections,
                    ...findSubSelections(current.selectionSet.selections, nextModelClass),
                };

                if (current.arguments.length > 0) {
                    current.arguments.forEach((argument) => {
                        if (argument.name.value === 'filter') {
                            const nameSpace = current.alias ? current.alias.value : relationName;

                            if (argument.value.fields) {
                                subSelections.$modify = argument.value.fields.map((field) => {
                                    if (!(nextModelClass.filters && nextModelClass.filters[field.name.value])) {
                                        throw new ImplementationError(`Tried to access unimplemented filter: ${field.name.value}`);
                                    }

                                    const filterName = `${nameSpace}.${field.name.value}`;
                                    let { value } = field.value;

                                    if (typeof value === 'undefined') {
                                        value = info.variableValues[field.value.name.value];
                                    }

                                    filters[filterName] = (builder) => (
                                        nextModelClass.filters[field.name.value](
                                            builder,
                                            value,
                                            auth,
                                        )
                                    );

                                    return filterName;
                                });
                            } else {
                                const filterValues = info.variableValues[argument.value.name.value];

                                subSelections.$modify = Object.entries(filterValues)
                                    .map(([key, value]) => {
                                        if (
                                            !(nextModelClass.filters
                                            && nextModelClass.filters[key])
                                        ) {
                                            throw new ImplementationError(`Tried to access unimplemented filter: ${key}`);
                                        }

                                        const filterName = `${nameSpace}.${key}`;

                                        filters[filterName] = (builder) => (
                                            nextModelClass.filters[key](
                                                builder,
                                                value,
                                                auth,
                                            )
                                        );

                                        return filterName;
                                    });
                            }
                        }
                    });
                }

                if (current.alias) {
                    subSelections.$relation = current.name.value;

                    return { ...result, [current.alias.value]: subSelections };
                }

                return { ...result, [current.name.value]: subSelections };
            }

            return result;
        }, {})
    );

    const relationExpression = {};

    info.fieldNodes.forEach((node) => {
        modifyRelationExpression(
            findSubSelections(node.selectionSet.selections, modelClass),
            relationExpression,
        );
    });

    if (additionalExpression) {
        if (Array.isArray(additionalExpression)) {
            additionalExpression.forEach((item) => {
                modifyRelationExpression(item, relationExpression);
            });
        } else {
            modifyRelationExpression(additionalExpression, relationExpression);
        }
    }

    const result = { relationExpression, filters };

    debug('result: %j', result);

    return result;
};
