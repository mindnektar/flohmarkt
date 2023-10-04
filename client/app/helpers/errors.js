export const serverErrorTypeMap = {
    clientOffline: {
        error: 'Es konnte keine Verbindung zum Server hergestellt werden. Bitte prüfen Sie Ihre Internetverbindung.',
        recovered: 'Die Internetverbindung wurde wiederhergestellt!',
    },
    networkError: {
        error: 'Der CARE-Server antwortet nicht. Unser Team wurde bereits benachrichtigt und arbeitet an einer Lösung.',
        recovered: 'CARE ist wieder online!',
    },
    queryError: {
        error: 'Diese Seite kann nicht angezeigt werden. Unser Team wurde bereits benachrichtigt und arbeitet an einer Lösung.',
    },
};

export const handleError = (name, callback) => (
    (errors) => {
        if (errors.graphQLErrors) {
            const error = errors.graphQLErrors.find(({ extensions }) => extensions.code === name);

            if (error) {
                callback(error.extensions.data);
            }
        }

        return errors;
    }
);
