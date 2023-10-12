import User from 'models/User';

export default {
    authorization: (_parent, _variables, { auth }) => (
        auth.isAdmin
    ),
    resolve: (_parent, { filter }, _context, info) => (
        User.query().filter(filter).withGraphqlGraphFetched(info)
    ),
};
