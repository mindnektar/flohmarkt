import path from 'path';
import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import bodyParser from 'body-parser';
import config from 'config';
import resolveTokens from './server/middleware/resolveTokens';

export default (app, apolloMiddleware) => {
    const corsMiddleware = cors();

    app.use(
        '/api',
        expressjwt({
            secret: config.jwt.secret,
            credentialsRequired: false,
            algorithms: ['HS256', 'HS384', 'HS512'],
        }),
        resolveTokens,
        corsMiddleware,
        bodyParser.json(),
        apolloMiddleware,
    );

    app.use(express.static(path.join(__dirname, '../../client/public')));
};
