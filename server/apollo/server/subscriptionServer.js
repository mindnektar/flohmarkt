import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const ALLOWED_JWT_ALGORITHMS = ['HS256', 'HS384', 'HS512'];

export default (schema) => {
    const webSocketServer = new WebSocketServer({ noServer: true });

    return [
        useServer(
            {
                schema,
                context: async ({ connectionParams }) => {
                    const token = connectionParams.Authorization;
                    const data = token && token.startsWith('Bearer ') ? (
                        jwt.verify(
                            token.replace('Bearer ', ''),
                            'some-secret',
                            { algorithms: ALLOWED_JWT_ALGORITHMS },
                        )
                    ) : (
                        null
                    );
                    const auth = null; // await authorize(data, token);

                    return { auth };
                },
            },
            webSocketServer,
            30000,
        ),
        webSocketServer,
    ];
};
