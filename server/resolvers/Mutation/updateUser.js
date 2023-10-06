import User from 'models/User';

export default {
    transaction: true,
    authorization: (_parent, { input }, { auth }) => (
        auth.hasUserId(input.id)
    ),
    resolve: (_parent, { input }, { trx }, info) => (
        User.query(trx).withGraphqlGraphFetched(info).upsertGraphAndFetch(input)
    ),
};
