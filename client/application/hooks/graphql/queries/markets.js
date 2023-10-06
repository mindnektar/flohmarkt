import { useQuery } from 'apollo-augmented-hooks';

const query = `
    query markets {
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
