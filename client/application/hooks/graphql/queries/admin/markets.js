import { useQuery } from 'apollo-augmented-hooks';

const query = `
    query adminMarkets {
        markets {
            id
            name
            startDate
            endDate
        }
    }
`;

export default () => (
    useQuery(query)
);
