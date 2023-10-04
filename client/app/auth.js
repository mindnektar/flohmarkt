export const AUTH_TYPE_NONE = 'flohmarkt-token-none';
export const AUTH_TYPE_ADMIN = 'flohmarkt-token-admin';
export const AUTH_TYPE_VENDOR = 'flohmarkt-token-vendor';
export const AUTH_TYPE_REGISTER = 'flohmarkt-token-register';

export const getToken = (authType) => (
    window.localStorage.read(authType)
);

export const setToken = (authType, token) => (
    window.localStorage.write(authType, token)
);

export const deleteToken = (authType) => (
    window.localStorage.remove(authType)
);
