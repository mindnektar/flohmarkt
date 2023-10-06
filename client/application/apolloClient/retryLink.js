import { RetryLink } from '@apollo/client/link/retry';

export default () => (
    new RetryLink({
        delay: {
            initial: 1000,
            jitter: true,
        },
        attempts: {
            max: 5,
            retryIf: (error, operation) => {
                const isMutation = !!operation?.query?.definitions?.some((definition) => definition.operation === 'mutation');

                return !!error && !isMutation;
            },
        },
    })
);
