import { ApolloClient, HttpLink, from, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import fetch from 'unfetch';
import { initAugmentedHooks, setGlobalContextHook } from 'apollo-augmented-hooks';
import useGlobalApolloContext from 'hooks/useGlobalApolloContext';
import cache from './apolloClient/cache';
import createWebSocketClient from './apolloClient/webSocket';
import createRecoveryLink from './apolloClient/recoveryLink';
import createErrorLink from './apolloClient/errorLink';
import createRetryLink from './apolloClient/retryLink';
import createContextLink from './apolloClient/contextLink';

let apolloClient;

const getApolloClient = () => (
    apolloClient
);

export default (localStorageRef) => {
    if (apolloClient) {
        return apolloClient;
    }

    const webSocketClient = createWebSocketClient(getApolloClient);

    apolloClient = new ApolloClient({
        link: split(
            ({ query }) => {
                const { kind, operation } = getMainDefinition(query);

                return kind === 'OperationDefinition' && operation === 'subscription';
            },
            new GraphQLWsLink(webSocketClient),
            from([
                createRecoveryLink(webSocketClient, localStorageRef),
                createErrorLink(localStorageRef),
                createRetryLink(),
                createContextLink(),
                new HttpLink({
                    uri: 'http://localhost:4300',
                    fetch,
                }),
            ]),
        ),
        cache,
        connectToDevTools: true,
    });

    apolloClient.restartWebSocketConnection = () => {
        if (webSocketClient.connected) {
            webSocketClient.terminate();
        }
    };

    initAugmentedHooks(apolloClient);
    setGlobalContextHook(useGlobalApolloContext);

    return apolloClient;
};
