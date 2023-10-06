const getPath = (data) => {
    if (!data?.userId) {
        return 'Anonymous';
    }

    if (data.role === 'admin') {
        return 'User/Admin';
    }

    return 'User';
};

export const getAuthorization = (data) => {
    const path = getPath(data);

    return require(`./auth/Base/${path}`).default;
};

export default async (data) => {
    const authorization = getAuthorization(data);

    try {
        return authorization.parse(data);
    } catch (error) {
        console.error(error);

        return require('./auth/Base/Anonymous').default.parse();
    }
};
