import { setContext } from '@apollo/client/link/context';
import { AUTH_TYPE_NONE } from 'hooks/useAuth';

export default () => (
    setContext((_, context) => {
        const token = context.authType === AUTH_TYPE_NONE ? null : window.localStorage.getItem(context.authType);

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
