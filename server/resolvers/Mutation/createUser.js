import User from 'models/User';

export default {
    transaction: true,
    authorization: (_parent, _variables, { auth }) => (
        auth.isAnonymous
    ),
    resolve: (_parent, { input }, { trx }, info) => (
        User.query(trx).withGraphqlGraphFetched(info).insertGraphAndFetch(input)
    ),
};
