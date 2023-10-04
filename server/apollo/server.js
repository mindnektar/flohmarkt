import { applyMiddleware } from 'graphql-middleware';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import tokenExpiredCheck from './server/middleware/tokenExpiredCheck';
import schema from './server/schema';
import createSubscriptionServer from './server/subscriptionServer';

export default (httpServer) => {
    const schemaWithMiddleware = applyMiddleware(schema, tokenExpiredCheck);
    const [subscriptionServer, webSocketServer, legacyWebSocketServer] = createSubscriptionServer(schemaWithMiddleware);
    const apolloServer = new ApolloServer({
        schema: schemaWithMiddleware,
        introspection: process.env.NODE_ENV !== 'production',
        csrfPrevention: false,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                serverWillStart: () => ({
                    drainServer: async () => {
                        subscriptionServer.dispose();
                    },
                }),
            },
        ],
    });

    return [apolloServer, webSocketServer, legacyWebSocketServer];
};
