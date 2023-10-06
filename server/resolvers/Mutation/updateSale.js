import Sale from 'models/Sale';

export default {
    transaction: true,
    authorization: (_parent, _variables, { auth }) => (
        auth.isRegister
    ),
    resolve: (_parent, { input }, { trx }, info) => (
        Sale.query(trx).withGraphqlGraphFetched(info).upsertGraphAndFetch(input, { relate: ['articles'] })
    ),
};
