import Vendor from 'models/Vendor';

export default {
    transaction: true,
    fixture: (_parent, { id }, { trx }) => (
        Vendor.query(trx).findById(id)
    ),
    authorization: (_parent, _variables, { auth, fixture }) => (
        auth.hasUserId(fixture.userId)
    ),
    resolve: async (_parent, _variables, { trx, fixture }) => {
        await fixture.$query(trx).delete();

        return fixture;
    },
};
