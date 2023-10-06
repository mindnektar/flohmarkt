import { getAuthorization } from 'auth';

export default class BaseAuthorization {
    setTokenData(tokenData) {
        this.tokenData = tokenData;
    }

    async refresh(data = this.tokenData?.data) {
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
