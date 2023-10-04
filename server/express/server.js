import path from 'path';
import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import bodyParser from 'body-parser';
import modifyBodyParserError from './server/middleware/modifyBodyParserError';

export default (app, apolloMiddleware) => {
    const corsMiddleware = cors();

    app.use(
        '/api',
        expressjwt({
            secret: 'some-secret',
            credentialsRequired: false,
            algorithms: ['HS256', 'HS384', 'HS512'],
        }),
        corsMiddleware,
        bodyParser.json(),
        apolloMiddleware,
        modifyBodyParserError,
    );

    app.use(express.static(path.join(__dirname, '../../client/public')));
};
