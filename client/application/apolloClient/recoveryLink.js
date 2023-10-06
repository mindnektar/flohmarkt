import { ApolloLink } from '@apollo/client';
import { serverErrorTypeMap } from 'helpers/errors';

export default (webSocketClient, localStorageRef) => (
    new ApolloLink((operation, forward) => (
        forward(operation).map((data) => {
            const serverErrorType = localStorageRef.read('serverErrorType');

            if (serverErrorType && serverErrorTypeMap[serverErrorType].recovered) {
                localStorageRef.write('serverErrorType', null);
                localStorageRef.write('toastie', {
                    type: 'serverError',
                    params: {
                        type: serverErrorType,
                        recovered: true,
                    },
                });
            }

            if (!webSocketClient.connected) {
                webSocketClient.terminate();
            }

            return data;
        })
    ))
);
