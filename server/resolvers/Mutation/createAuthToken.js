import User from 'models/User';

export default {
    authorization: (_parent, _variables, { auth }) => (
        auth.isAnonymous
    ),
    resolve: async (_parent, { input }) => {
        const user = await User.findAndAuthenticate(input.email, input.password);

        return {
            authToken: await user.createAndSignAuthToken(),
            renewalToken: 'tbd',
            role: user.role,
        };
    },
};
