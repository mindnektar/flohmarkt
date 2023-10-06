import Market from 'models/Market';

export default {
    authorization: (_parent, _variables, { auth }) => (
        auth.isAdmin
    ),
    resolve: (_parent, _variables, _context, info) => (
        Market.query().withGraphqlGraphFetched(info)
    ),
};
