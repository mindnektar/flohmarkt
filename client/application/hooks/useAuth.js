import useLocalStorage from 'hooks/useLocalStorage';

export const AUTH_TYPE_NONE = 'flohmarkt-token-none';
export const AUTH_TYPE_ADMIN = 'flohmarkt-token-admin';
export const AUTH_TYPE_VENDOR = 'flohmarkt-token-vendor';

export default () => {
    const [authType, setAuthType] = useLocalStorage('authType');

    return {
        authType,
        getToken: () => (
            window.localStorage.getItem(authType)
        ),
        setToken: (type, token) => {
            window.localStorage.setItem(type, token);
            setAuthType(type);
        },
        deleteToken: () => {
            window.localStorage.removeItem(authType);
            setAuthType(AUTH_TYPE_NONE);
        },
    };
};
