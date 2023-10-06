import Market from 'models/Market';

export default {
    transaction: true,
    authorization: (_parent, _variables, { auth }) => (
        auth.isAdmin
    ),
    resolve: async (_parent, { id }, { trx }) => {
        const market = await Market.query(trx).findById(id);

        await market.$query(trx).delete();

        return market;
    },
};
