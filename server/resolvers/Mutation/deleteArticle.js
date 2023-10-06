import Article from 'models/Article';

export default {
    transaction: true,
    fixture: (_parent, { id }, { trx }) => (
        Article.query(trx).findById(id).withGraphFetched('vendor')
    ),
    authorization: (_parent, _variables, { auth, fixture }) => (
        auth.hasUserId(fixture.vendor.userId)
    ),
    resolve: async (_parent, _variables, { trx, fixture }) => {
        await fixture.$query(trx).delete();

        return fixture;
    },
};
