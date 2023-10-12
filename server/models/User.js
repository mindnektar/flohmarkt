import util from 'util';
import jwt from 'jsonwebtoken';
import config from 'config';
import { ClientError } from 'errors';
import bcrypt from 'services/bcrypt';
import BaseModel from './_base';

const jwtSign = util.promisify(jwt.sign);

export default class User extends BaseModel {
    static get relationMappings() {
        return {
            vendors: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'Vendor',
                join: {
                    from: 'user.id',
                    to: 'vendor.userId',
                },
            },
        };
    }

    static get filters() {
        return {
            role: (builder, value) => (
                builder.where('role', value)
            ),
        };
    }

    static async ensureAdminExists() {
        const admin = await User.query().where('role', 'admin').first();

        if (!admin) {
            await User
                .query()
                .insertGraph({
                    role: 'admin',
                    email: 'ausdenk@gmail.com',
                    passwordHash: await bcrypt.hash('1234'),
                    firstName: 'Martin',
                    lastName: 'Denk',
                });
        }
    }

    static async findAndAuthenticate(email, password) {
        const user = await User.query().where('email', email).first();

        if (!user) {
            throw new ClientError(ClientError.CODE.INVALID_CREDENTIALS);
        }

        const isAuthenticated = await bcrypt.compare(password, user.passwordHash);

        if (!isAuthenticated) {
            throw new ClientError(ClientError.CODE.INVALID_CREDENTIALS);
        }

        return user;
    }

    async createAndSignAuthToken() {
        const token = await jwtSign(
            {
                userId: this.id,
                role: this.role,
            },
            config.jwt.secret,
            config.tokens.identity,
        );

        return token;
    }
}
