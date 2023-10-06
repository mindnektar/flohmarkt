import Market from 'models/Market';

export default {
    transaction: true,
    authorization: (_parent, _variables, { auth }) => (
        auth.isAdmin
    ),
    resolve: (_parent, { input }, { trx }, info) => (
        Market.query(trx).withGraphqlGraphFetched(info).upsertGraphAndFetch(input)
    ),
};
