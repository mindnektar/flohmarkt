import UserAuthorization from 'auth/Base/User';

export default class AdminAuthorization extends UserAuthorization {
    get isAdmin() {
        return true;
    }
}
