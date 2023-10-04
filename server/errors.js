/* eslint-disable max-classes-per-file */
import { GraphQLError } from 'graphql';

export class CareError extends GraphQLError {
    constructor({ type, code, message, data, name }) {
        super(message || code, { name, extensions: { type, code, data, name } });
    }
}

// Throw this if the application enters an error state that should not occur during normal operation and that does not need to be handled by
// clients
export class InternalServerError extends CareError {
    constructor(message, data) {
        super({ type: 'INTERNAL_SERVER_ERROR', message, data });
    }
}

// Throw this to remind the backend developer to add a missing implementation
export class ImplementationError extends CareError {
    constructor(message) {
        super({ type: 'IMPLEMENTATION_ERROR', message });
    }
}

// Throw this if the application enters an error state that can occur during normal operation and should be handled by clients
export class ClientError extends CareError {
    constructor(code, data) {
        super({ type: 'CLIENT_ERROR', code, data });
    }

    static get CODE() {
        return {
            AUTHORIZATION_REQUIRED: 'AUTHORIZATION_REQUIRED',
            TOKEN_EXPIRED: 'TOKEN_EXPIRED',
        };
    }
}
