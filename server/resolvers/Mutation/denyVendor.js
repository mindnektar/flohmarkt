import Vendor from 'models/Vendor';

export default {
    transaction: true,
    authorization: (_parent, _variables, { auth }) => (
        auth.isAdmin
    ),
    resolve: (_parent, { input }, { trx }, info) => (
        Vendor.query(trx).withGraphqlGraphFetched(info).upsertGraphAndFetch({ id: input.id, isApproved: false })
    ),
};
