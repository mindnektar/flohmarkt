import Vendor from 'models/Vendor';

export default {
    transaction: true,
    authorization: (_parent, { input }, { auth }) => (
        auth.hasUserId(input.userId)
    ),
    resolve: (_parent, { input }, { trx }, info) => (
        Vendor.query(trx).withGraphqlGraphFetched(info).insertGraphAndFetch(input)
    ),
};
