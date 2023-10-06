import Article from 'models/Article';
import Vendor from 'models/Vendor';

export default {
    transaction: true,
    fixture: (_parent, { input }, { trx }) => (
        Vendor.query(trx).findById(input.vendorId)
    ),
    authorization: (_parent, _variables, { auth, fixture }) => (
        auth.hasUserId(fixture.userId)
    ),
    resolve: (_parent, { input }, { trx }, info) => (
        Article.query(trx).withGraphqlGraphFetched(info).insertGraphAndFetch(input)
    ),
};
