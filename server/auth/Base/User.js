import BaseAuthorization from 'auth/Base';
import User from 'models/User';

export default class UserAuthorization extends BaseAuthorization {
    constructor(user) {
        super();
        this.user = user;
    }

    static async parse({ userId }) {
        const user = await User.query().findById(userId);

        if (!user) {
            throw new Error();
        }

        return new this(user);
    }

    get isAnonymous() {
        return false;
    }

    get isUser() {
        return true;
    }

    hasUserId(userId) {
        return this.user.id === userId;
    }
}
