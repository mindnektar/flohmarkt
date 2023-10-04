import fs from 'fs';
import { withFilter } from 'graphql-subscriptions';
import { ClientError, ImplementationError } from 'errors';
import transaction from 'helpers/transaction';
import requestIncludes from './loadResolvers/requestIncludes';

const wrapSubscription = (name, { authorization, resolve, onComplete, filter }) => ({
    resolve: async (parent, variables, context, info) => {
        const resolverContext = {
            ...context,
            requestIncludes: (path) => requestIncludes(info, path),
            refreshAuth: async (tokenData) => {
                context.auth = await context.auth.refresh(tokenData);
            },
        };
        const result = resolve ? await resolve(parent, variables, resolverContext, info) : parent;

        if (onComplete) {
            await onComplete(parent, variables, { ...resolverContext, result }, info);
        }

        return result;
    },
    subscribe: withFilter(
        (parent, variables, context, info) => {
            if (authorization && !authorization(parent, variables, context, info)) {
                throw new ClientError(ClientError.CODE.AUTHORIZATION_REQUIRED, {
                    resolver: name,
                    auth: context.auth,
                });
            }

            return context.pubsub.asyncIterator(name);
        },
        filter || (() => true),
    ),
});

const fetchFixture = async (fixture, parent, variables, context, info) => {
    if (!fixture) {
        return undefined;
    }

    return fixture(parent, variables, context, info);
};

const wrapResolver = (name, type, { fixture, authorization, resolve, onComplete, transacting }) => (
    async (parent, variables, context, info) => {
        const authorizeAndResolve = async (trx) => {
            const fixtureContext = {
                ...context,
                trx,
                requestIncludes: (path) => requestIncludes(info, path),
            };
            const fixtureResult = await fetchFixture(fixture, parent, variables, fixtureContext, info);
            const resolverContext = { ...fixtureContext, fixture: fixtureResult };

            if (!authorization && ['Query', 'Mutation', 'Subscription'].includes(type)) {
                throw new ImplementationError(`No authorization implemented for resolver "${name}".`);
            }

            if (authorization && !authorization(parent, variables, resolverContext, info)) {
                await context.auth.deleteFromCache();
                throw new ClientError(ClientError.CODE.AUTHORIZATION_REQUIRED, {
                    resolver: name,
                    auth: context.auth,
                });
            }

            return {
                result: resolve
                    ? await resolve(parent, variables, resolverContext, info)
                    : parent?.[name],
                fixtureResult,
            };
        };

        const { result, fixtureResult } = transacting ? await transaction(authorizeAndResolve) : await authorizeAndResolve();

        if (onComplete) {
            const onCompleteContext = {
                ...context,
                fixture: fixtureResult,
                result,
                refreshAuth: async (tokenData) => {
                    context.auth = await context.auth.refresh(tokenData);
                },
            };

            await onComplete(parent, variables, onCompleteContext, info);
        }

        return result;
    }
);

const loadResolversForType = (directory, type) => {
    const files = fs.readdirSync(directory);

    return files.reduce((result, file) => {
        if (!file.match(/test\.js$/) && fs.statSync(`${directory}/${file}`).isFile()) {
            const resolverName = file.replace(/\.js$/, '');
            const { default: resolver } = require(`${directory}/${file}`);

            return {
                ...result,
                [resolverName]: type === 'Subscription'
                    ? wrapSubscription(resolverName, resolver)
                    : wrapResolver(resolverName, type, resolver),
            };
        }

        return result;
    }, Promise.resolve({}));
};

export default (directory) => {
    const files = fs.readdirSync(directory);

    return files.reduce((result, file) => {
        if (fs.statSync(`${directory}/${file}`).isDirectory()) {
            return {
                ...result,
                [file]: loadResolversForType(`${directory}/${file}`, file),
            };
        }

        return result;
    }, {});
};
