import { useQuery } from 'apollo-augmented-hooks';

const query = `
    query adminAdmins($filter: UserFilter) {
        users(filter: $filter) {
            id
            email
            firstName
            lastName
        }
    }
`;

export default () => (
    useQuery(query, {
        variables: {
            filter: {
                role: 'admin',
            },
        },
    })
);
