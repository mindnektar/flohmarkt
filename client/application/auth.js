export const AUTH_TYPE_NONE = 'flohmarkt-token-none';
export const AUTH_TYPE_ADMIN = 'flohmarkt-token-admin';
export const AUTH_TYPE_VENDOR = 'flohmarkt-token-vendor';

export const getToken = (authType) => (
    window.localStorage.getItem(authType)
);

export const setToken = (authType, token) => (
    window.localStorage.setItem(authType, token)
);

export const deleteToken = (authType) => (
    window.localStorage.removeItem(authType)
);
