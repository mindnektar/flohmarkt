import Sale from 'models/Sale';

export default {
    transaction: true,
    authorization: (_parent, _variables, { auth }) => (
        auth.isRegister
    ),
    resolve: async (_parent, { id }, { trx }) => {
        const sale = await Sale.query(trx).findById(id);

        await sale.$query(trx).delete();

        return sale;
    },
};
