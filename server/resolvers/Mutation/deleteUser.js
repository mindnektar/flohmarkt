import User from 'models/User';

export default {
    transaction: true,
    authorization: (_parent, { id }, { auth }) => (
        auth.hasUserId(id)
    ),
    resolve: async (_parent, { id }, { trx }) => {
        const user = await User.query(trx).findById(id);

        await user.$query(trx).delete();

        return user;
    },
};
