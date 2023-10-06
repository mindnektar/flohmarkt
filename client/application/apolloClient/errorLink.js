import { onError } from '@apollo/client/link/error';

export default (localStorageRef) => (
    onError(({ operation, graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ extensions }) => {
                if (extensions.type === 'CLIENT_ERROR') {
                    if (extensions.code === 'TOKEN_EXPIRED' || extensions.code === 'AUTHORIZATION_REQUIRED') {
                        const { authType } = operation.getContext();

                        window.localStorage.removeItem(authType);
                        window.location.reload();
                    }
                } else {
                    localStorageRef.write('serverErrorType', 'queryError');
                    localStorageRef.write('toastie', {
                        type: 'serverError',
                        params: {
                            type: 'queryError',
                            recovered: false,
                        },
                    });
                }
            });
        } else if (networkError) {
            let serverErrorType = 'networkError';

            if (!navigator.onLine) {
                serverErrorType = 'clientOffline';
            }

            localStorageRef.write('serverErrorType', serverErrorType);
            localStorageRef.write('toastie', {
                type: 'serverError',
                params: {
                    type: serverErrorType,
                    recovered: false,
                },
            });
        }
    })
);
