import { useMutation } from 'apollo-augmented-hooks';

const mutation = `
    mutation createAuthToken($input: CreateAuthTokenInput!) {
        createAuthToken(input: $input) {
            authToken
            role
        }
    }
`;

export default () => {
    const [mutate] = useMutation(mutation);

    return (input) => (
        mutate({ input })
    );
};
