import Article from 'models/Article';

export default {
    transaction: true,
    fixture: (_parent, { input }, { trx }) => (
        Article.query(trx).findById(input.id).withGraphFetched('vendor')
    ),
    authorization: (_parent, _variables, { auth, fixture }) => (
        auth.hasUserId(fixture.vendor.userId)
    ),
    resolve: (_parent, { input }, { trx }, info) => (
        Article.query(trx).withGraphqlGraphFetched(info).upsertGraphAndFetch(input)
    ),
};
