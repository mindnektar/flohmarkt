import { createClient } from 'graphql-ws';
import axios from 'axios';
import { getToken, AUTH_TYPE_VENDOR, AUTH_TYPE_REGISTER, AUTH_TYPE_ADMIN } from 'auth';

const jitter = (value) => (
    value + ((Math.random() * value) - (value / 2))
);

const waitForHealthyServer = () => (
    new Promise((resolve) => {
        let delay = 0;

        const performHealthCheck = async () => {
            if (delay < 60000) {
                delay += 5000;
            }

            try {
                const response = await axios.get('http://localhost:4300/status');

                if (response.status === 200) {
                    resolve(true);
                } else {
                    throw new Error();
                }
            } catch (error) {
                window.setTimeout(performHealthCheck, jitter(delay));
            }
        };

        window.setTimeout(performHealthCheck, jitter(2000));
    })
);

export default (getApolloClient) => {
    let shouldPerformRefetchAfterReconnect = false;

    const repopulateCache = async () => {
        const apolloClient = getApolloClient();

        try {
            // Remove all locally stored data and refetch all active queries to keep up with changes made by other users while the web
            // socket connection was down
            await apolloClient.clearStore();
        } catch (error) {
            // Resetting the store does not work while a query is in flight, so if that happens, wait a couple of seconds and try again
            window.setTimeout(repopulateCache, jitter(2000));

            return;
        }

        await apolloClient.refetchQueries({ include: 'active' });
    };

    const webSocketClient = createClient({
        url: 'ws://localhost:4300',
        retryAttempts: Infinity,
        shouldRetry: () => true,
        retryWait: waitForHealthyServer,
        connectionParams: () => {
            const path = window.location.hash.substring(1);
            const authTypeMap = {
                '/admin': AUTH_TYPE_ADMIN,
                '/vendor': AUTH_TYPE_VENDOR,
                '/register': AUTH_TYPE_REGISTER,
            };
            const authType = authTypeMap[Object.keys(authTypeMap).find((subPath) => path.startsWith(subPath))] || AUTH_TYPE_ADMIN;
            const token = getToken(authType);

            if (!token) {
                return {};
            }

            return { Authorization: `Bearer ${token}` };
        },
        on: {
            connected: () => {
                webSocketClient.connected = true;

                if (shouldPerformRefetchAfterReconnect) {
                    shouldPerformRefetchAfterReconnect = false;
                    repopulateCache();
                }
            },
            closed: (event) => {
                // Codes other than 1000 are abrupt closes and should trigger the query refetch after a reconnect
                if (event.code !== 1000) {
                    webSocketClient.connected = false;
                    shouldPerformRefetchAfterReconnect = true;
                }
            },
        },
    });

    return webSocketClient;
};
