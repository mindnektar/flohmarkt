import { setContext } from '@apollo/client/link/context';
import { getToken, AUTH_TYPE_NONE } from 'auth';

export default () => (
    setContext((_, context) => {
        const token = context.authType === AUTH_TYPE_NONE ? null : getToken(context.authType);

        if (!token) {
            return context;
        }

        return {
            ...context,
            headers: {
                ...context.headers,
                Authorization: `Bearer ${token}`,
            },
        };
    })
);
