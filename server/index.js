import http from 'http';
import express from 'express';
import User from 'models/User';
import createApolloServer from './apollo/server';
import createExpressMiddleware from './apollo/expressMiddleware';
import createExpressServer from './express/server';

(async () => {
    const app = express();
    const httpServer = http.createServer(app);
    const [apolloServer, webSocketServer] = createApolloServer(httpServer);

    httpServer.on('upgrade', (request, socket, head) => {
        webSocketServer.handleUpgrade(
            request,
            socket,
            head,
            (ws) => {
                webSocketServer.emit('connection', ws, request);
            },
        );
    });

    await apolloServer.start();
    createExpressServer(app, createExpressMiddleware(apolloServer));

    await User.ensureAdminExists();

    await new Promise((resolve) => {
        httpServer.listen(4300, resolve);
    });

    console.log('Server running on port 4300, http://localhost:4300');
})();
