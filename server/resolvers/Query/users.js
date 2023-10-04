import User from 'models/User';

export default {
    authorization: (_parent, _variables, { auth }) => (
        auth.isAdmin
    ),
    resolve: (_parent, _variables, _context, info) => (
        User.query().withGraphqlGraphFetched(info)
    ),
};
