import { useMutation } from 'apollo-augmented-hooks';

const mutation = `
    mutation createMarket($input: CreateMarketInput!) {
        createMarket(input: $input) {
            id
            name
            startDate
            endDate
            isOpenForVendors
        }
    }
`;

export default () => {
    const [mutate] = useMutation(mutation);

    return (input) => (
        mutate({
            input,
            modifiers: [{
                fields: {
                    markets: ({ includeIf }) => (
                        includeIf(true)
                    ),
                },
            }],
        })
    );
};
