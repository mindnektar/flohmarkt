import { getAuthorization } from 'auth';

export default class BaseAuthorization {
    async refresh(data) {
        return getAuthorization(data).parse(data);
    }

    get isAnonymous() {
        return true;
    }

    get isAdmin() {
        return false;
    }

    get isUser() {
        return false;
    }
}
