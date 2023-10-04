import { ClientError } from 'errors';

export default (resolve, parent, variables, context, info) => {
    if (context.tokenExpired) {
        throw new ClientError(ClientError.CODE.TOKEN_EXPIRED);
    }

    return resolve(parent, variables, context, info);
};
