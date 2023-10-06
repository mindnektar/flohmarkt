import Market from 'models/Market';

export default {
    authorization: (_parent, _variables, { auth }) => (
        auth.isUser
    ),
    resolve: (_parent, { id }, _context, info) => (
        Market.query().findById(id).withGraphqlGraphFetched(info)
    ),
};
