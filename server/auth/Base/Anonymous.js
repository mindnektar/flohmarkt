import BaseAuthorization from 'auth/Base';

export default class AnonymousAuthorization extends BaseAuthorization {
    static async parse() {
        return new AnonymousAuthorization();
    }
}
