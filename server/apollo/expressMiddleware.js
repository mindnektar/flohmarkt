import { expressMiddleware } from '@apollo/server/express4';

export default (apolloServer) => (
    expressMiddleware(apolloServer, {
        context: async ({ req }) => ({
            auth: req.auth,
            tokenExpired: req.tokenExpired,
        }),
    })
);
